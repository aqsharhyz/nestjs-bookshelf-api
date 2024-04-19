import { ZodType, z } from 'zod';

export class BookValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(1).max(100),
    year: z.number().int().min(1).max(new Date().getFullYear()),
    author: z.string().min(1).max(100),
    publisher: z.string().min(1).max(100),
    isFinished: z.boolean(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().int().min(1).positive(),
    title: z.string().min(1).max(100).optional(),
    year: z.number().int().min(1).max(new Date().getFullYear()).optional(),
    author: z.string().min(1).max(100).optional(),
    publisher: z.string().min(1).max(100).optional(),
    isFinished: z.boolean().optional(),
  });
}
