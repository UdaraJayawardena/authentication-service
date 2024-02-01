const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const ServiceModuleField = require('./serviceModuleField');

const Routes = require('./routes');

module.exports = {

  ServiceModuleFieldController: Controller,

  ServiceModuleFieldDatabase: Database,

  ServiceModuleFieldMiddleware: Middleware,

  ServiceModuleFieldRoutes: Routes,

  ServiceModuleFieldService: Service,

  ServiceModuleField: ServiceModuleField
};