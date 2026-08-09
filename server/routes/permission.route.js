const router = require('express').Router();
const permission = require('../controllers/permission.controller');
const { validate } = require('../middlewares/validate');
const { asyncHandler } = require('../middlewares/error');
const { verifyToken, requirePermission } = require('../middlewares/verify');
const { permissionSchema, updatePermissionSchema } = require('../validators/permission.validators');

router.get('/', verifyToken, requirePermission('role.read'), permission.list);
router.get('/:id', verifyToken, requirePermission('role.read'), permission.get);
router.post('/', verifyToken, requirePermission('role.create'), validate(permissionSchema), permission.create);
router.patch('/:id', verifyToken, requirePermission('role.update'), validate(updatePermissionSchema), permission.update);
router.delete('/:id', verifyToken, requirePermission('role.update'), permission.archive);

module.exports = router;
