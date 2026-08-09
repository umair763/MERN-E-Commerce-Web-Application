const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { verifyToken, requireRole } = require('../middlewares/verify');

router.get('/', verifyToken, requireRole('admin', 'super_admin'), userController.getAllUsers);
router.get('/:id', verifyToken, requireRole('admin', 'super_admin'), userController.getUserById);
router.post('/', verifyToken, requireRole('super_admin'), userController.createUser);
router.put('/:id', verifyToken, requireRole('super_admin'), userController.updateUser);
router.delete('/:id', verifyToken, requireRole('super_admin'), userController.deleteUser);

module.exports = router;
