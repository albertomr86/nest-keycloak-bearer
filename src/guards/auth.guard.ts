import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { REQUEST_RESOLVER, TOKEN_EXTRACTOR } from '../constants';
import { GrantManagerService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    @Inject(REQUEST_RESOLVER)
    private readonly resolveRequest,

    @Inject(TOKEN_EXTRACTOR)
    private readonly extractTokenFromRequest,

    private readonly grantManager: GrantManagerService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = this.resolveRequest(context);

    if (!req) {
      return false;
    }

    return Promise.resolve(this.extractTokenFromRequest(req))
      .then((access_token) => this.grantManager.validateToken(access_token))
      .then((token) => {
        req.krealm = token.realm;
        req.kuser = token.body.sub;
        return true;
      })
      .catch(() => false);
  }
}
