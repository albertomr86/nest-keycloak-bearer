export interface NestKeycloakOptions {
  /**
   * Authentication server URL.
   * @see {KeycloakConnectOptions#authServerUrl}
   */
  serverUrl: string;

  /**
   * Client/Application ID.
   * @see {KeycloakConnectOptions#resource}
   */
  clientId?: string;
}
