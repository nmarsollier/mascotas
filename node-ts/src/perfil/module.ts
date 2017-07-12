"use strict";

import { Express } from "express";

import * as authorization from "../seguridad/authorization.service";
import * as perfil from "./perfil.service";

export function init(app: Express) {
  app
    .route("/perfil")
    .get(perfil.findByCurrentUser, perfil.read)
    .post(authorization.requiresLogin, perfil.findProvincia, perfil.update);
}
