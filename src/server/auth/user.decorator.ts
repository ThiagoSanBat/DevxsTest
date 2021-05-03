import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Principal = createParamDecorator((data, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().principal;
});
