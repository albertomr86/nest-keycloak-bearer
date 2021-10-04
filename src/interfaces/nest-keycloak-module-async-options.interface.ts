import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { NestKeycloakOptionsFactory } from './nest-keycloak-options-factory.interface';
import { NestKeycloakOptions } from './nest-keycloak-options.interface';

export interface NestKeycloakModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<NestKeycloakOptionsFactory>;
  useClass?: Type<NestKeycloakOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<NestKeycloakOptions> | NestKeycloakOptions;
}
