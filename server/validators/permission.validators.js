const { z } = require('zod');

const permissionSchema = z.object({
  key: z.string().trim().min(1).max(100),
  module: z.string().trim().min(1).max(50),
  action: z.string().trim().min(1).max(50),
  description: z.string().trim().max(255).optional(),
  isActive: z.boolean().optional(),
});

const updatePermissionSchema = permissionSchema.partial().strict();

module.exports = { permissionSchema, updatePermissionSchema };
