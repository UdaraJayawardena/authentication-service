const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const AccessRight = require('./access-right');

const Routes = require('./routes');

module.exports = {

  AccessRightController: Controller,

  AccessRightDatabase: Database,

  AccessRightMiddleware: Middleware,

  AccessRightRoutes: Routes,

  AccessRightService: Service,

  AccessRight: AccessRight
};