"use strict";

import * as passport from "passport";
import * as passportLocal from "passport-local";
import * as mongoose from "mongoose";
import { Usuario } from "./usuario.schema";

const LocalStrategy = passportLocal.Strategy;

export function init() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "login",
        passwordField: "password"
      },
      function(username: string, password: string, done: Function) {
        Usuario.findOne(
          {
            login: username
          },
          function(err: any, user: any) {
            if (err) {
              return done(err);
            }
            if (!user) {
              return done(undefined, false, {
                message: "Usuario o contraseña incorrecta."
              });
            }
            if (!user.authenticate(password)) {
              return done(undefined, false, {
                message: "Usuario o contraseña incorrecta"
              });
            }

            return done(undefined, user);
          }
        );
      }
    )
  );
}
