const router = require('express').Router();
const role = require('../controllers/role.controller');
const { validate } = require('../middlewares/validate');
const { asyncHandler } = require('../middlewares/error');
const { verifyToken, requirePermission } = require('../middlewares/verify');
const { roleSchema, updateRoleSchema } = require('../validators/role.validators');

router.get('/', verifyToken, requirePermission('role.read'), role.list);
router.get('/:id', verifyToken, requirePermission('role.read'), role.get);
router.post('/', verifyToken, requirePermission('role.create'), validate(roleSchema), role.create);
router.patch('/:id', verifyToken, requirePermission('role.update'), validate(updateRoleSchema), role.update);
router.delete('/:id', verifyToken, requirePermission('role.update'), role.archive);

module.exports = router;
