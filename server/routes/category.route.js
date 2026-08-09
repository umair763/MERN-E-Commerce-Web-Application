const r = require('express').Router();
const c = require('../controllers/category.controller');
const { verifyToken, requireRole } = require('../middlewares/verify');
r.get('/', c.list);
r.post('/', verifyToken, requireRole('admin', 'manager'), c.create);
r.patch('/:id', verifyToken, requireRole('admin', 'manager'), c.update);
r.delete('/:id', verifyToken, requireRole('admin', 'manager'), c.remove);
module.exports = r;
