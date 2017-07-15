"use strict";

import { Express } from "express";

import * as security from "../seguridad/security.service";
import * as perfil from "./perfil.service";
import * as passport from "passport";

export function init(app: Express) {
  app
    .route("/perfil")
    .get(passport.authenticate("jwt", { session: false }), perfil.fillForCurrentUser, perfil.read)
    .post(passport.authenticate("jwt", { session: false }), perfil.fillProvinciaIfPresent, perfil.fillForCurrentUser, perfil.validateUpdate, perfil.update);
}
