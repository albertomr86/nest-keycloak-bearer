import * as http from 'http';
import * as https from 'https';
import { Inject, Injectable } from '@nestjs/common';
import { Key } from '../entities';
import { JWK_TO_PEM } from '../constants';

@Injectable()
export class KeycloakJWKSService {
  private static readonly CERTS_URL: string = 'protocol/openid-connect/certs';

  public constructor(@Inject(JWK_TO_PEM) private readonly jkwToPem) {}

  public async getPEMs(realmUrl: string): Promise<{ jwk: Key; pem: string }[]> {
    return this.retrieveJWKS(realmUrl).then((keys) =>
      keys.map((jwk) => ({
        jwk,
        pem: this.jkwToPem(jwk),
      })),
    );
  }

  public retrieveJWKS(realmUrl: string): Promise<Key[]> {
    const options = new URL(`${realmUrl}/${KeycloakJWKSService.CERTS_URL}`);
    const client = options.protocol === 'https:' ? https : http;

    return new Promise((resolve, reject) => {
      client
        .request(
          {
            method: 'GET',
            host: options.hostname,
            port: options.port,
            path: options.pathname,
          },
          (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
              return reject(new Error('Error fetching JKW Keys'));
            }

            let body = '';
            res.on('data', (chunk: Buffer) => (body += chunk.toString()));
            res.on('end', () => {
              resolve(JSON.parse(body).keys);
            });
          },
        )
        .end();
    });
  }
}
