import { Module, DynamicModule, Provider } from '@nestjs/common';
import { NEST_KEYCLOAK_OPTIONS } from './constants';
import {
  NestKeycloakOptions,
  NestKeycloakModuleAsyncOptions,
  NestKeycloakOptionsFactory,
} from './interfaces';
import {
  jwkToPemProvider,
  resolveRequestProvider,
  tokenExtractorProvider,
  createNestKeycloakOptionsProvider,
} from './nest-keycloak-bearer.providers';
import {
  GrantManagerService,
  KeycloakJWKSService,
  TokenVerifierService,
} from './services';

@Module({})
export class NestKeycloakBearerModule {
  public static register(options: NestKeycloakOptions): DynamicModule {
    const optionsProvider = createNestKeycloakOptionsProvider(options);

    return {
      module: NestKeycloakBearerModule,
      providers: [
        optionsProvider,
        jwkToPemProvider,
        resolveRequestProvider,
        tokenExtractorProvider,
        KeycloakJWKSService,
        TokenVerifierService,
        GrantManagerService,
      ],
      exports: [
        resolveRequestProvider,
        tokenExtractorProvider,
        GrantManagerService,
      ],
    };
  }

  public static registerAsync(
    options: NestKeycloakModuleAsyncOptions,
  ): DynamicModule {
    const providers = this.createAsyncProviders(options);

    return {
      module: NestKeycloakBearerModule,
      imports: options.imports || [],
      providers,
      exports: [
        resolveRequestProvider,
        tokenExtractorProvider,
        GrantManagerService,
      ],
    };
  }

  private static createAsyncProviders(
    options: NestKeycloakModuleAsyncOptions,
  ): Provider[] {
    const reqProviders = [
      this.createAsyncOptionsProvider(options),
      jwkToPemProvider,
      resolveRequestProvider,
      tokenExtractorProvider,
      KeycloakJWKSService,
      TokenVerifierService,
      GrantManagerService,
    ];

    if (options.useExisting || options.useFactory) {
      return reqProviders;
    }

    return [
      ...reqProviders,
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: NestKeycloakModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: NEST_KEYCLOAK_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: NEST_KEYCLOAK_OPTIONS,
      useFactory: async (optionsFactory: NestKeycloakOptionsFactory) =>
        await optionsFactory.createNestKeycloakOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
