import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RawBody = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        return req.body;
    },
);