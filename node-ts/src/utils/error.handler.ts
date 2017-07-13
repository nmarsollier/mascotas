"use strict";

export const ERROR_UNATORIZED = 401;
export const ERROR_NOT_FOUND = 404;
export const ERROR_UNAUTORIZED_METHOD = 405;
export const ERROR_BAD_REQUEST = 400;
export const ERROR_INTERNAL_ERROR = 500;
export const ERROR_NOT_IMPLEMENTED = 501;


// Obtiene un error adecuando cuando hay errores de db
const getUniqueErrorMessage = function(err: any) {
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
    return { error: "El campo ya existe" };
  }
};

// Obtiene un error adecuado cuando hay errores desconocidos de db
export function getErrorMessage(err: any) {
  let message: any = "Error desconocido.";
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getUniqueErrorMessage(err);
        break;
    }
  } else if (err.errors) {
    message = err.errors;
  }
  return message;
}
