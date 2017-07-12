"use strict";

import { Express } from "express";

import * as security from "../seguridad/security.service";
import * as perfil from "./perfil.service";

export function init(app: Express) {
  app
    .route("/perfil")
    .get(perfil.findByCurrentUser, perfil.read)
    .post(security.requiresLogin, perfil.findProvincia, perfil.update);
}
