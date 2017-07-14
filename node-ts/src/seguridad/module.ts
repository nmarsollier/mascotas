"use strict";

import { Express } from "express";
import * as security from "./security.service";
import * as passport from "passport";

/**
 * Modulo de seguridad, login/logout, cambio de contraseñas, etc
 */
export function init(app: Express) {
  app.route("/users/password").post(passport.authenticate("jwt", { session: false }), security.cambiarPassword);

  app.route("/auth/signup").put(security.signup);
  app.route("/auth/signin").post(security.signin);
  app.route("/auth/signout").get(passport.authenticate("jwt", { session: false }), security.signout);

  app
    .route("/auth/currentUser")
    .get(passport.authenticate("jwt", { session: false }), security.currentUser);
}
