const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const Functionality = require('./functionality');

const Routes = require('./routes');

module.exports = {

  FunctionalityController: Controller,

  FunctionalityDatabase: Database,

  FunctionalityMiddleware: Middleware,

  FunctionalityRoutes: Routes,

  FunctionalityService: Service,

  Functionality: Functionality
};