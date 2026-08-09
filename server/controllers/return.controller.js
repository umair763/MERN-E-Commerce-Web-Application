const ReturnRequest = require('../models/return.model'),
  Order = require('../models/order.model');
const { asyncHandler, AppError } = require('../middlewares/error');
const { createAuditLog } = require('../helpers/audit.helper');
const create = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.body.orderId,
    user: req.user._id,
    status: 'delivered',
  });
  if (!order) throw new AppError('Only delivered orders can be returned', 400);
  
  const returnRequest = await ReturnRequest.create({
    order: order._id,
    user: req.user._id,
    items: req.body.items,
    reason: req.body.reason,
  });
  
  await createAuditLog(req.user._id, 'create', 'ReturnRequest', returnRequest._id, null, { orderId: order._id, reason: req.body.reason });
  
  res
    .status(201)
    .json({
      success: true,
      data: returnRequest,
    });
});
const mine = asyncHandler(async (req, res) =>
  res.json({
    success: true,
    data: await ReturnRequest.find({ user: req.user._id }).sort('-createdAt'),
  }),
);
const adminList = asyncHandler(async (req, res) =>
  res.json({
    success: true,
    data: await ReturnRequest.find()
      .populate('user', 'name email')
      .populate('order'),
  }),
);
const update = asyncHandler(async (req, res) => {
  const returnRequest = await ReturnRequest.findById(req.params.id);
  if (!returnRequest) throw new AppError('Return request not found', 404);

  const validTransitions = {
    requested: ['processing'],
    processing: ['accepted', 'rejected'],
    accepted: [],
    rejected: [],
  };

  const currentStatus = returnRequest.status;
  const newStatus = req.body.status;

  if (!validTransitions[currentStatus].includes(newStatus)) {
    throw new AppError(`Cannot transition from ${currentStatus} to ${newStatus}`, 400);
  }

  returnRequest.status = newStatus;
  returnRequest.resolutionNote = req.body.resolutionNote;
  returnRequest.approvedBy = req.user._id;
  await returnRequest.save();

  if (newStatus === 'accepted') {
    await Order.findByIdAndUpdate(returnRequest.order, { status: 'returned' });
  }

  res.json({ success: true, data: returnRequest });
});
module.exports = { create, mine, adminList, update };
