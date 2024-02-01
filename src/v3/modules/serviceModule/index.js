const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const ServiceModule = require('./serviceModule');

const Routes = require('./routes');

module.exports = {

  ServiceModuleController: Controller,

  ServiceModuleDatabase: Database,

  ServiceModuleMiddleware: Middleware,

  ServiceModuleRoutes: Routes,

  ServiceModuleService: Service,

  ServiceModule: ServiceModule
};