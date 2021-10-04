import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { extractRequestFromContext } from '../util';

/**
 * Retrieves the current Keycloak logged-in user.
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = extractRequestFromContext(ctx);
    return req.kuser;
  },
);
