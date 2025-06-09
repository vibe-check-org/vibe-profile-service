/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * Das Modul enthält die Konfiguration für _Keycloak_.
 * @packageDocumentation
 */

import {
    type KeycloakConnectConfig,
    PolicyEnforcementMode,
    TokenValidation,
} from 'nest-keycloak-connect';
import { config } from './app.js';
import { env } from './env.js';

const { keycloak } = config;

if (keycloak !== undefined && keycloak !== null) {
    if (
        keycloak.schema !== undefined &&
        typeof keycloak.schema !== 'string' &&
        keycloak.port !== undefined &&
        typeof keycloak.port !== 'number'
    ) {
        throw new TypeError(
            'Die Konfiguration für Keycloak (Schema und Port) ist falsch',
        );
    }
    if (keycloak.realm !== undefined && typeof keycloak.realm !== 'string') {
        throw new TypeError(
            'Der konfigurierte Realm-Name für Keycloak ist kein String',
        );
    }
    if (
        keycloak.clientId !== undefined &&
        typeof keycloak.clientId !== 'string'
    ) {
        throw new TypeError(
            'Der konfigurierte Client-ID für Keycloak ist kein String',
        );
    }
    if (
        keycloak.tokenValidation !== undefined &&
        Object.values(TokenValidation).includes(keycloak.tokenValidation) // eslint-disable-line @typescript-eslint/no-unsafe-argument
    ) {
        throw new TypeError(
            'Der konfigurierte Wert für TokenValidation bei Keycloak ist ungültig',
        );
    }
}

const schema = (keycloak?.schema as string | undefined) ?? 'http';
const host = (keycloak?.host as string | undefined) ?? 'keycloak';
const port = (keycloak?.port as number | undefined) ?? 8080;
const authServerUrl = `${schema}://${host}:${port}/auth`;
// Keycloak ist in Sicherheits-Bereich (= realms) unterteilt
const realm = (keycloak?.realm as string | undefined) ?? 'nest';
const clientId = (keycloak?.clientId as string | undefined) ?? 'nest-client';
const tokenValidation =
    (keycloak?.tokenValidation as TokenValidation | undefined) ??
    (TokenValidation.ONLINE as TokenValidation);

const { CLIENT_SECRET, NODE_ENV } = env;

export const keycloakConnectOptions: KeycloakConnectConfig = {
    authServerUrl,
    realm,
    clientId,
    secret:
        CLIENT_SECRET ??
        'ERROR: Umgebungsvariable CLIENT_SECRET nicht gesetzt!',
    policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
    tokenValidation,
};
if (NODE_ENV === 'development') {
    console.debug('keycloakConnectOptions = %o', keycloakConnectOptions);
} else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { secret, ...keycloakConnectOptionsLog } = keycloakConnectOptions;
    console.debug('keycloakConnectOptions = %o', keycloakConnectOptionsLog);
}

/** Pfade für den REST-Client zu Keycloak */
export const paths = {
    accessToken: `realms/${realm}/protocol/openid-connect/token`,
    userInfo: `realms/${realm}/protocol/openid-connect/userinfo`,
    introspect: `realms/${realm}/protocol/openid-connect/token/introspect`,
};
