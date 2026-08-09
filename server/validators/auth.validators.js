const { z } = require('zod');
const password = z.string().min(8).max(72);
const email = z
  .string()
  .trim()
  .email()
  .transform((value) => value.toLowerCase());
const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email,
  password,
  contact: z.string().trim().max(30).optional(),
});
const loginSchema = z.object({ email, password });
const profileSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    email,
    contact: z.string().trim().max(30).optional(),
  })
  .strict();
const passwordSchema = z.object({
  currentPassword: password,
  newPassword: password,
});
module.exports = { registerSchema, loginSchema, profileSchema, passwordSchema };
