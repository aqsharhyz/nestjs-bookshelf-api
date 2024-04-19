import { ZodType, z } from 'zod';

export class CommentValidation {
  static readonly POST: ZodType = z.object({
    content: z.string().min(1).max(1000),
  });

  static readonly UPDATE: ZodType = z.object({
    content: z.string().min(1).max(1000).optional(),
  });
}
