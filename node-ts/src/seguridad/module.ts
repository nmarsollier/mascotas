"use strict";

import { Express } from "express";
import * as authentication from "./authentication.service";
import * as authorization from "./authorization.service";
import * as password from "./password.service";
import * as passport from "./passport";

/**
 * Configura e inicializa los contenidos del Modulo
 */
export function init(app: Express) {
  passport.init();

  app.route("/users/password").post(password.cambiarPassword);

  app.route("/auth/signup").put(authentication.signup);
  app.route("/auth/signin").post(authentication.signin);
  app.route("/auth/signout").get(authentication.signout);
  app
    .route("/auth/currentUser")
    .get(authorization.requiresLogin, authentication.currentUser);

  app.param("userId", authorization.findByID);
}
