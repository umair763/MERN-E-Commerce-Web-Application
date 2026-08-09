const router = require('express').Router();
const controller = require('../controllers/address.controller');
const { verifyToken } = require('../middlewares/verify');

router.use(verifyToken);

router.get('/', controller.list);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
