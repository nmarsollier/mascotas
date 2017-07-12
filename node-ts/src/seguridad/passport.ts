"use strict";

import * as passport from "passport";
import * as mongoose from "mongoose";
import * as path from "path";
import * as local from "./local";
import { Usuario, IUsuario } from "./usuario.schema";

/**
 * Module init function.
 */
export function init() {
  // Serialize sessions
  passport.serializeUser(function(user: IUsuario, done: Function) {
    done(undefined, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function(id: string, done: Function) {
    Usuario.findOne(
      {
        _id: id
      },
      "-salt -password",
      function(err, user) {
        done(err, user);
      }
    );
  });

  // Initialize strategies
  local.init();
}
