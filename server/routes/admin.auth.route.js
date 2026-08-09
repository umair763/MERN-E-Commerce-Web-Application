const router = require('express').Router();
const auth = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate');
const { asyncHandler } = require('../middlewares/error');
const { loginSchema } = require('../validators/auth.validators');

router.post('/signin', validate(loginSchema), auth.adminLogin);

module.exports = router;
