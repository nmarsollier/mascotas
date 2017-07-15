"use strict";

import { Config } from "./environment";
import { NextFunction } from "express-serve-static-core";

import * as express from "express";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import * as path from "path";
import * as helmet from "helmet";
import * as mongo from "connect-mongo";
import * as cors from "cors";
import * as compression from "compression";
import * as passport from "passport";
import * as expressValidator from "express-validator";

// Modulos de la aplicacion
import * as indexModule from "../index/module";
import * as mascotasModule from "../pet/module";
import * as perfilModule from "../profile/module";
import * as provinciasModule from "../provinces/module";
import * as seguridadModule from "../security/module";
import * as errorHandler from "../utils/error.handler";
import * as pasportHanlder from "../security/passport";

export function init(appConfig: Config): express.Express {
  const app = express();
  app.set("port", appConfig.port);

  // Habilitar Cors
  app.use(cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true
  }));

  // Si estamos en level debug, debaguear los request
  if (appConfig.logLevel == "debug") {
    app.use(morgan("dev"));
  }

  // Configuramos el server para que tome los json correctamente
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Configurar express para comprimir contenidos de text en http
  app.use(compression());

  // Configuramos passport, authenticacion por tokens y db
  app.use(passport.initialize());
  app.use(passport.session());

  // Permite hacer validaciones de parametros req.assert
  app.use(expressValidator());

  // helmet le da seguridad al sistema para prevenir hacks
  app.use(helmet.xssFilter());  // Previene inyeccion de javascript
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.disable("x-powered-by");

  // Esta es la ruta de contenidos estaticos, no deberian haber muchos pero algo de documentacion
  // vendria bien como contenido estatico.
  app.use(
    express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 })
  );

  pasportHanlder.init();
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
