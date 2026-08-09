const router = require('express').Router();
const settingsController = require('../controllers/settings.controller');
const { verifyToken, requireRole } = require('../middlewares/verify');

router.get('/', verifyToken, requireRole('super_admin'), settingsController.getAllSettings);
router.get('/:key', verifyToken, requireRole('super_admin'), settingsController.getSettingByKey);
router.post('/', verifyToken, requireRole('super_admin'), settingsController.createSetting);
router.put('/:key', verifyToken, requireRole('super_admin'), settingsController.updateSetting);
router.delete('/:key', verifyToken, requireRole('super_admin'), settingsController.deleteSetting);

module.exports = router;
