import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { extractRequestFromContext } from '../util';
import { Subject } from '../entities';

/**
 * Retrieves the current Keycloak user and realm.
 */
export const Identity = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = extractRequestFromContext(ctx);

    return new Subject(req.krealm, req.kuser);
  },
);
