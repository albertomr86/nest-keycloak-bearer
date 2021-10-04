# Nest Keycloak Bearer

![GitHub](https://img.shields.io/github/license/albertomr86/nest-keycloak-bearer)
[![Verify Build](https://github.com/albertomr86/nest-keycloak-bearer/actions/workflows/verify-build.yml/badge.svg?branch=master)](https://github.com/albertomr86/nest-keycloak-bearer/actions/workflows/verify-build.yml)

Protect your resources (API or GraphQL) with Keycloak JWT tokens.

## Features

- Protect your resources using Keycloak's Authorization Tokens.
- Compatible with REST and GraphQL.
- Multi-tenant support (tokens generated from multiple realms).

## How does it work?

When a JWT token is noticed in the request (Authorization header), the validation process is as follows:

1. The `iss` field is used to determine the realm that issued the token.
2. All public keys belonging to the realm are retrieved and kept cache for subsequent requests.
3. Token's `kid` is looked up in the list of retrieved keys.
4. The token is validated with the key indicated by the `kid` field of the token.

## Installation

```
npm i nest-keycloak-bearer
```

or

```
yarn add nest-keycloak-bearer
```

## Getting Started

Import and register the module in your app module.

```typescript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { NestKeycloakBearerModule, AuthGuard } from 'nest-keycloak-bearer';

@Module({
  imports: [
    NestKeycloakBearerModule.register({
      // This is Keycloak's base auth url.
      serverUrl: 'http://localhost:8080/auth',
      // Keycloak client.
      clientId: 'node-app',
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
```

The `AuthGuard` guard will look for a bearer JWT in the `Authorization` headers of the request.

## Decorators

- `Public`: When used, indicates the handler does not require validation.
- `Realm`: Extracts the Keycloak's realm that generated the token.
- `User`: Extract the user id (sub) contained in the token.
- `Identity`: Extract the user id (sub) and the realm at the same time (Subject).

## Examples

### REST Controller

```typescript
import { Controller, Resource, Get } from '@nestjs/common';
import { Realm, User } from 'nest-keycloak-bearer';

@Controller()
export class HelloController {
  @Get()
  async getMessage(
    @Realm() realm: string,
    @User() user: string,
  ): Promise<string> {
    return `Hello ${realm}:${user}`;
  }
}
```

### GraphQL

```typescript
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Realm, User, Identity, Subject } from 'nest-keycloak-bearer';

@Resolver()
export class ListMembersResolver {
  @Query()
  async getMessage(
    @Realm() realm: string,
    @User() user: string,
  ): Promise<string> {
    return `Hello ${realm}:${user}`;
  }

  @Query(() => UserDto)
  async getProfile(@Identity() identity: Subject): Promise<UserDto> {
    // Fake: Fecth the user from the database.
    const user = await this.userRepository.fetchTenantUser(
      identity.realm,
      identity.user,
    );

    // Fake: Convert DB entity and return a Dto.
    return UserDto.fromEntity(user);
  }
}
```
