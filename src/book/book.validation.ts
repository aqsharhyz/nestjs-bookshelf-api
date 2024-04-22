import { ZodType, z } from 'zod';

export class BookValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(1).max(100),
    year: z.number().int().min(1).max(new Date().getFullYear()),
    author: z.string().min(1).max(100),
    publisher: z.string().min(1).max(100),
    isFinished: z.boolean(),
    categoryName: z.string().min(1).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().int().min(1).positive(),
    title: z.string().min(1).max(100).optional(),
    year: z.number().int().min(1).max(new Date().getFullYear()).optional(),
    author: z.string().min(1).max(100).optional(),
    publisher: z.string().min(1).max(100).optional(),
    isFinished: z.boolean().optional(),
    categoryName: z.string().min(1).max(100).optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    title: z.string().min(1).max(100).optional(),
    year: z.number().int().min(1).max(new Date().getFullYear()).optional(),
    author: z.string().min(1).max(100).optional(),
    publisher: z.string().min(1).max(100).optional(),
    isFinished: z.boolean().optional(),
    categoryName: z.string().min(1).max(100).optional(),
    page: z.number().int().min(1).positive().optional().default(1),
    size: z.number().int().min(1).positive().optional().default(10),
  });

  static readonly SIMPLE_SEARCH: ZodType = z.object({
    search: z.string().min(1).max(100),
    page: z.number().min(1).max(10000).optional().default(1),
  });
}
