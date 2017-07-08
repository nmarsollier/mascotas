"use strict";

// Obtiene un error adecuando cuando hay errores de db
var getUniqueErrorMessage = function(err) {
  var output;

  try {
    var fieldName = err.err.substring(
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
exports.getErrorMessage = function(err) {
  var message = "Error desconocido.";
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
};
