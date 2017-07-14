"use strict";

import { Config } from "./environment";
import { NextFunction } from "express-serve-static-core";

import * as express from "express";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import * as path from "path";
import * as helmet from "helmet";
import * as session from "express-session";
import * as mongo from "connect-mongo";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as compression from "compression";
import * as passport from "passport";
import * as expressValidator from "express-validator";

// Modulos de la aplicacion
import * as indexModule from "../index/module";
import * as mascotasModule from "../mascotas/module";
import * as perfilModule from "../perfil/module";
import * as provinciasModule from "../provincias/module";
import * as seguridadModule from "../seguridad/module";
import * as errorHandler from "../utils/error.handler";

export function init(appConfig: Config): express.Express {
  const app = express();
  app.set("port", appConfig.port);

  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.url = req.protocol + "://" + req.headers.host + req.url;
    next();
  });

  // Permitir cualquier origen en CORS
  const corsOptions = {
    origin: appConfig.corsEnabled,
    optionsSuccessStatus: 200,
    credentials: true
  };
  app.use(cors(corsOptions));

  // Mostrar errors de stack en la consola
  app.set("showStackError", true);

  // Si estamos en level debug, debaguear los request
  if (appConfig.logLevel == "debug") {
    app.use(morgan("dev"));
  }

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Configurar express para comprimir contenidos de text en http
  app.use(compression());

  // Para que express entienda cookies
  app.use(cookieParser());

  // Configuracion de Mongo
  const mongoStore = mongo(session);
  app.use(
    session({
      saveUninitialized: true,
      resave: true,
      secret: appConfig.sessionSecret,
      store: new mongoStore({
        url: appConfig.db,
        autoReconnect: true
      })
    })
  );

  // Configuramos passport, ver passport.js es la configuracion de authenticacion por db
  app.use(passport.initialize());
  app.use(passport.session());

  // helmet le da seguridad al sistema para prevenir hacks
  app.use(expressValidator());

  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.disable("x-powered-by");

  // Esta es la ruta de contenidos estaticos, no deberian haber muchos pero algo de documentacion
  // vendria bien como contenido estatico.
  app.use(
    express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 })
  );

  indexModule.init(app);
  mascotasModule.init(app);
  perfilModule.init(app);
  provinciasModule.init(app);
  seguridadModule.init(app);

  // Para el manejo de errores, para que los loguee en la consola
  app.use(function (err: any, req: express.Request, res: express.Response, next: NextFunction) {
    if (!err) return next();

    console.error(err.message);

    res.status(err.status || errorHandler.ERROR_INTERNAL_ERROR);
    res.json({
      message: err.message
    });
  });

  // Responder con JSON cuando hay un error 404, sino responde con un html
  // Esto tiene que ir al final porque sino nos sobreescribe las otras rutas
  app.use(function (req, res) {
    res.status(errorHandler.ERROR_NOT_FOUND);
    res.json({
      url: req.originalUrl,
      error: "Not Found"
    });
  });

  return app;
}
