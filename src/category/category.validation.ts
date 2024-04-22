import { ZodType, z } from 'zod';

export class CategoryValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(3).max(255),
    description: z.string().min(3).max(255),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(3).max(255).optional(),
    description: z.string().min(3).max(255).optional(),
  });
}
