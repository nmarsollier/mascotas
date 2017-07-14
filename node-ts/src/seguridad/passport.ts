"use strict";

import { Usuario } from "./usuario.schema";
import { Config } from "../config/environment";
import * as appConfig from "../config/environment";
import { remove } from "../mascotas/mascota.service";
import { IUserSession } from "./security.service";

import * as passport from "passport";
import * as passportJwt from "passport-jwt";
import * as mongoose from "mongoose";
import * as _ from "lodash";

const conf = appConfig.getConfig(process.env);

export function init() {
    const Strategy = passportJwt.Strategy;
    const ExtractJwt = passportJwt.ExtractJwt;

    const params = {
        secretOrKey: conf.jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeader()
    };

    passport.use(new Strategy(params, function (payload: IUserSession, done) {
        if (!payload || _.isEmpty(payload.id)) {
            return done(undefined, false, {
                message: "Invalid Token"
            });
        }

        return done(undefined, payload);
    }));
}
