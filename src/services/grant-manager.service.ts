import { Inject, Injectable } from '@nestjs/common';
import { Token } from '../entities';
import { NestKeycloakOptions } from '../interfaces';
import { NEST_KEYCLOAK_OPTIONS } from '../constants';
import { KeycloakJWKSService } from './keycloak-jwks.service';
import { TokenVerifierService } from './token-verifier.service';

@Injectable()
export class GrantManagerService {
  public constructor(
    private readonly keycloakJwks: KeycloakJWKSService,
    private readonly tokenVerifier: TokenVerifierService,
    @Inject(NEST_KEYCLOAK_OPTIONS)
    private readonly options: NestKeycloakOptions,
  ) {}

  public async validateToken(token: string): Promise<Token> {
    if (!token) {
      throw new Error('invalid token (missing)');
    }

    const parsedToken = new Token(token);

    if (parsedToken.isExpired) {
      throw new Error('invalid token (expired)');
    }

    if (!parsedToken.signed) {
      throw new Error('invalid token (not signed)');
    }

    const realmUrl = `${this.options.serverUrl}/realms/${parsedToken.realm}`;
    const key = await this.keycloakJwks
      .getPEMs(realmUrl)
      .then((pems) =>
        pems.find((pem) => pem.jwk.kid === parsedToken.headers.kid),
      )
      .then((pem) => pem?.pem);

    if (!key) {
      throw new Error('invalid token (unknown kid)');
    }

    const isValid = await this.tokenVerifier.verify(parsedToken, key);

    if (!isValid) {
      throw new Error('invalid token (public key signature)');
    }

    return parsedToken;
  }
}
