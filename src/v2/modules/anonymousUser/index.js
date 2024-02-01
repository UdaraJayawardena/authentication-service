const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const AnonymousUser = require('./anonymousUser');

const Routes = require('./routes');

module.exports = {

  AnonymousUserController: Controller,

  AnonymousUserDatabase: Database,

  AnonymousUserMiddleware: Middleware,

  AnonymousUserRoutes: Routes,

  AnonymousUserService: Service,

  AnonymousUser: AnonymousUser
};