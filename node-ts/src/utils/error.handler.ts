"use strict";

import * as express from "express";

export const ERROR_UNATORIZED = 401;
export const ERROR_NOT_FOUND = 404;
export const ERROR_UNAUTORIZED_METHOD = 405;
export const ERROR_BAD_REQUEST = 400;
export const ERROR_INTERNAL_ERROR = 500;
export const ERROR_NOT_IMPLEMENTED = 501;
export const ERROR_ALREADY_EXISTS = 409;


// Obtiene un error adecuando cuando hay errores de db
function getUniqueErrorMessage(err: any) {
  let output;

  try {
    const fieldName = err.err.substring(
      err.err.lastIndexOf(".$") + 2,
      err.err.lastIndexOf("_1")
    );

    output = {
      path: fieldName,
      message:
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + " ya existe"
    };

    return { message: output };
  } catch (ex) {
    return { error: "El registro ya existe. Registro duplicado." };
  }
}

export function handleError(res: express.Response, err: any): express.Response {
    res.status(ERROR_INTERNAL_ERROR);

  let message: any = "Error desconocido.";
  if (err.code) {   // Database Error
    switch (err.code) {
      case 11000:
      case 11001:
        res.status(ERROR_ALREADY_EXISTS);
        res.header("X-Status-Reason: Already exist");
        message = getUniqueErrorMessage(err);
        break;
    }
  } else if (err.errors) {  // Validatino Error
    res.header("X-Status-Reason: Validation failed");
    res.status(ERROR_BAD_REQUEST);
    message = err.errors;
  }

  return res.send({
    message: message
  });
}