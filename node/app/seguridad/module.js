'use strict';

module.exports = function(app) {

  require('./usuario.schema.js');

  require('./usuario.controller.js')(app);

  require('./strategy/passport.js')();
};
