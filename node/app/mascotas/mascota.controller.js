'use strict';

/**
 * Dependencias.
 */
var authorization = require('../seguridad/authorization.service'),
	mascota = require('./mascota.service');

module.exports = function(app) {
	// Routas de acceso a mascotas
	app.route('/mascota')
	  .get(authorization.requiresLogin, mascota.findByCurrentUser)
		.put(authorization.requiresLogin, mascota.update);

	app.route('/mascota/:mascotaId')
		.get(mascota.read)
		.post(authorization.requiresLogin, mascota.hasAuthorization, mascota.update)
		.delete(authorization.requiresLogin, mascota.hasAuthorization, mascota.delete);

	// Filtro que agrega la mascota cuando se pasa como parametro el id
	app.param('mascotaId', mascota.findByID);
};
