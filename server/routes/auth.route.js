const router = require('express').Router();
const auth = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate');
const { asyncHandler } = require('../middlewares/error');
const { verifyToken, requireRole } = require('../middlewares/verify');
const {
  registerSchema,
  loginSchema,
  profileSchema,
  passwordSchema,
} = require('../validators/auth.validators');
router.post('/register', validate(registerSchema), auth.register);
router.post('/login', validate(loginSchema), auth.login);
router.post('/logout', auth.logout);
router.get('/profile', verifyToken, auth.profile);
router.patch(
  '/profile',
  verifyToken,
  validate(profileSchema),
  auth.updateProfile,
);
router.patch(
  '/password',
  verifyToken,
  validate(passwordSchema),
  auth.changePassword,
);
router.get('/customers', verifyToken, requireRole('admin', 'super_admin'), auth.getCustomers);
module.exports = router;
