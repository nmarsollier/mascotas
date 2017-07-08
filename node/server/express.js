"use strict";

var fs = require("fs"),
  http = require("http"),
  https = require("https"),
  express = require("express"),
  cors = require("cors"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  session = require("express-session"),
  compress = require("compression"),
  methodOverride = require("method-override"),
  cookieParser = require("cookie-parser"),
  helmet = require("helmet"),
  passport = require("passport"),
  mongoStore = require("connect-mongo")({
    session: session
  }),
  config = require("./" + (process.env.NODE_ENV || "config.development")),
  consolidate = require("consolidate"),
  path = require("path");

module.exports = function(db) {
  // Inicializar express
  var app = express();

  // Passing the request url to environment locals
  app.use(function(req, res, next) {
    res.locals.url = req.protocol + "://" + req.headers.host + req.url;
    next();
  });

  // Configurar express para comprimir contenidos de text en http
  app.use(
    compress({
      filter: function(req, res) {
        return /json|text|javascript|css/.test(res.getHeader("Content-Type"));
      },
      level: 9
    })
  );

  // Permitir cualquier origen en CORS
  var corsOptions = {
    origin: "http://localhost:4200",
    optionsSuccessStatus: 200,
    credentials: true
  };
  app.use(cors(corsOptions));

  // Mostrar errors de stack en la consola
  app.set("showStackError", true);

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "config.development") {
    // En entornos dev, morgan nos loguea los reuqest en la consola
    app.use(morgan("dev"));
  }

  // Request body parsing middleware should be above methodOverride
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(bodyParser.json());
  app.use(methodOverride());

  // Para que express entienda cookies
  app.use(cookieParser());

  // Configuracion de Mongo
  app.use(
    session({
      saveUninitialized: true,
      resave: true,
      secret: config.sessionSecret,
      store: new mongoStore({
        url: config.db
      })
    })
  );

  // Configuramos passport, ver passport.js es la configuracion de authenticacion por db
  app.use(passport.initialize());
  app.use(passport.session());

  // helmet le da seguridad al sistema para prevenir hacks
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.disable("x-powered-by");

  // Esta es la ruta de contenidos estaticos, no deberian haber muchos pero algo de documentacion
  // vendria bien como contenido estatico.
  app.use(express.static(path.resolve("./public")));

  // Modulos de la aplicacion a cargar
  require("../app/index/module.js")(app);
  require("../app/seguridad/module.js")(app);
  require("../app/provincias/module.js")(app);
  require("../app/perfil/module.js")(app);
  require("../app/mascotas/module.js")(app);

  // Para el manejo de errores, para que los loguee en la consola
  app.use(function(err, req, res, next) {
    if (!err) return next();

    console.error(err.message);

    res.status(err.status || 500);
    res.json({
      message: err.message
    });
  });

  // Responder con JSON cuando hay un error 404, sino responde con un html
  app.use(function(req, res) {
    res.status(404);
    res.json({
      url: req.originalUrl,
      error: "Not Found"
    });
  });

  return app;
};
