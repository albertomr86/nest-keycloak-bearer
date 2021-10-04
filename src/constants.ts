/**
 * Resolves the configuration of the module.
 */
export const NEST_KEYCLOAK_OPTIONS = Symbol('NEST_KEYCLOAK_OPTIONS');

/**
 * Resolves an injectable that can convert a JWK to a PEM format.
 */
export const JWK_TO_PEM = Symbol('JWK_TO_PEM');

/**
 * Resolves an injectable that can extarct the request from the current context.
 */
export const REQUEST_RESOLVER = Symbol('REQUEST_RESOLVER');

/**
 * Resolves an injectable that can extract the token from the request.
 */
export const TOKEN_EXTRACTOR = Symbol('TOKEN_EXTRACTOR');
