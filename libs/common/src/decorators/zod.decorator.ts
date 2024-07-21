import { ZodValidationPipe } from '@app/common/pipes/zod-validation/zod-validation.pipe';
import { applyDecorators, UsePipes } from '@nestjs/common';
import { ZodSchema } from 'zod';

export function ZodValidation(schema: ZodSchema) {
  return applyDecorators(UsePipes(new ZodValidationPipe(schema)));
}
