const { z } = require('zod');

const roleSchema = z.object({
  name: z.string().trim().min(1).max(50),
  level: z.number().int().min(0).max(3),
  permissions: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
  isDefault: z.boolean().optional(),
  description: z.string().trim().max(255).optional(),
  isActive: z.boolean().optional(),
});

const updateRoleSchema = roleSchema.partial().strict();

module.exports = { roleSchema, updateRoleSchema };
