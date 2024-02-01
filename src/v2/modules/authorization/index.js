const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const authorization = require('./authorization');

const Routes = require('./routes');

module.exports = {

  authorizationController: Controller,

  authorizationDatabase: Database,

  authorizationMiddleware: Middleware,

  authorizationRoutes: Routes,

  authorizationService: Service,

  authorization: authorization
};