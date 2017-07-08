'use strict';

module.exports = function(app) {
  require('./mascota.schema.js');
  require('./mascota.controller.js')(app);
};
