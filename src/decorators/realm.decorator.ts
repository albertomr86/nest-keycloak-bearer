import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { extractRequestFromContext } from '../util';

/**
 * Retrieves the current Keycloak realm.
 */
export const Realm = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = extractRequestFromContext(ctx);
    return req.krealm;
  },
);
