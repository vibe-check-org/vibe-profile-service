/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { env } from './env.js';
import { nodeConfig } from './node.js';
import { resolve } from 'node:path';
import { config } from './user.js';
import pino from 'pino';
import { PrettyOptions } from 'pino-pretty';

const logDirDefault = 'log';
const logFileNameDefault = 'server.log';
const logFileDefault = resolve(logDirDefault, logFileNameDefault);

const { nodeEnv } = nodeConfig;
const { log } = config;

export const loggerDefaultValue =
    env.LOG_DEFAULT?.toLowerCase() === 'true' || log?.default === true;

const logDir: string | undefined =
    (log?.dir as string | undefined) === undefined
        ? undefined
        : log.dir.trimEnd();

const logFile =
    logDir === undefined ? logFileDefault : resolve(logDir, logFileNameDefault);
const pretty = log?.pretty === true;

// https://getpino.io
// Log-Levels: fatal, error, warn, info, debug, trace
// Alternativen: Winston, log4js, Bunyan
// Pino wird auch von Fastify genutzt.
// https://blog.appsignal.com/2021/09/01/best-practices-for-logging-in-nodejs.html

let logLevel = 'info';
if (
    log?.level === 'debug' &&
    nodeEnv !== 'production' &&
    nodeEnv !== 'PRODUCTION' &&
    !loggerDefaultValue
) {
    logLevel = 'debug';
}

if (!loggerDefaultValue) {
    console.debug(
        `logger config: logLevel=${logLevel}, logFile=${logFile}, pretty=${pretty}, loggerDefaultValue=${loggerDefaultValue}`,
    );
}

const fileOptions = {
    level: logLevel,
    target: 'pino/file',
    options: { destination: logFile, mkdir: true },
};
const prettyOptions: PrettyOptions = {
    translateTime: 'SYS:standard',
    singleLine: true,
    colorize: true,
    ignore: 'pid,hostname',
};
const prettyTransportOptions = {
    level: logLevel,
    target: 'pino-pretty',
    options: prettyOptions,
    redact: ['name, Kunde, kunde, id'],
};

const options: pino.TransportMultiOptions | pino.TransportSingleOptions = pretty
    ? {
          targets: [fileOptions, prettyTransportOptions],
      }
    : {
          targets: [fileOptions],
      };
// in pino: type ThreadStream = any
// type-coverage:ignore-next-line
const transports = pino.transport(options);

// https://github.com/pinojs/pino/issues/1160#issuecomment-944081187
export const parentLogger: pino.Logger<string> = loggerDefaultValue
    ? pino(pino.destination(logFileDefault))
    : pino({ level: logLevel }, transports);
