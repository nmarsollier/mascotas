"use strict";

import * as dotenv from "dotenv";

let config: Config;

export function getConfig(environment: any): Config {
  if (!config) {
    dotenv.config({ path: ".env.example" });

    config = {
      port: process.env.SERVER_PORT ||  "3000",
      logLevel: process.env.LOG_LEVEL || "debug",
      sessionSecret: process.env.SESSION_SECRET ||  "0e199b23b15da57e8eedd482a956c535",
      db: process.env.MONGODB || "mongodb://localhost/mascotas",
      enableHttpRequestLogging: false,
      corsEnabled: process.env.CORS_ENABLED ||  "http://localhost:4200"
    };
  }
  return config;
}

export interface Config {
  port: string;
  logLevel: string; // 'debug' | 'verbose' | 'info' | 'warn' | 'error';
  sessionSecret: string;
  db: string;
  enableHttpRequestLogging: boolean;
  corsEnabled: string;
}
