"use strict";

export function getConfig(environment: any): Config {
  return {
    port: 3000,
    logLevel: "debug",
    sessionSecret: "0e199b23b15da57e8eedd482a956c535",
    db: "mongodb://localhost/mascotas",
    enableHttpRequestLogging: false,
    corsServer: "http://localhost:4200"
  };
}

export interface Config {
  port: number;
  logLevel: string; // 'debug' | 'verbose' | 'info' | 'warn' | 'error';
  sessionSecret: string;
  db: string;
  enableHttpRequestLogging: boolean;
  corsServer: string;
}
