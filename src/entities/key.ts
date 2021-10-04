import { JWK } from 'jwk-to-pem';

export { JWK };

export type Key = JWK & {
  kid: string;
  alg: string;
};
