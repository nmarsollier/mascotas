'use strict';

module.exports = function(app) {
  require('./perfil.schema.js');
  require('./perfil.controller.js')(app);
};
