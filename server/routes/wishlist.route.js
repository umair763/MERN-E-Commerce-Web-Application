const r = require('express').Router();
const c = require('../controllers/wishlist.controller');
const { verifyToken } = require('../middlewares/verify');
r.use(verifyToken);
r.get('/', c.list);
r.post('/:productId', c.add);
r.delete('/:productId', c.remove);
module.exports = r;
