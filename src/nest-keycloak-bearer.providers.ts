import * as jwkToPem from 'jwk-to-pem';
import { ValueProvider } from '@nestjs/common';
import { JWK } from './entities';
import {
  NEST_KEYCLOAK_OPTIONS,
  JWK_TO_PEM,
  REQUEST_RESOLVER,
  TOKEN_EXTRACTOR,
} from './constants';
import { NestKeycloakOptions } from './interfaces';
import { extractRequestFromContext, extractTokenFromRequest } from './util';

export const createNestKeycloakOptionsProvider = (
  options: NestKeycloakOptions,
): ValueProvider => {
  return {
    provide: NEST_KEYCLOAK_OPTIONS,
    useValue: options,
  };
};

export const jwkToPemProvider: ValueProvider = {
  provide: JWK_TO_PEM,
  useValue: (key: JWK) => jwkToPem(key),
};

export const resolveRequestProvider: ValueProvider = {
  provide: REQUEST_RESOLVER,
  useValue: extractRequestFromContext,
};

export const tokenExtractorProvider: ValueProvider = {
  provide: TOKEN_EXTRACTOR,
  useValue: extractTokenFromRequest,
};
