import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { Token } from '../entities';

@Injectable()
export class TokenVerifierService {
  private static readonly ALGORITHM: string = 'RSA-SHA256';

  public async verify(token: Token, publicKey: string): Promise<boolean> {
    const verify = crypto.createVerify(TokenVerifierService.ALGORITHM);

    verify.update(token.signed);

    return verify.verify(publicKey, token.signature);
  }
}
