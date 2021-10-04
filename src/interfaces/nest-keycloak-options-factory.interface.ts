import { NestKeycloakOptions } from './nest-keycloak-options.interface';

export interface NestKeycloakOptionsFactory {
  createNestKeycloakOptions():
    | Promise<NestKeycloakOptions>
    | NestKeycloakOptions;
}
