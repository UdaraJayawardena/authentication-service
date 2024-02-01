const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const BackendService = require('./backendService');

const Routes = require('./routes');

module.exports = {

  BackendServiceController: Controller,

  BackendServiceDatabase: Database,

  BackendServiceMiddleware: Middleware,

  BackendServiceRoutes: Routes,

  BackendServiceService: Service,

  BackendService: BackendService
};