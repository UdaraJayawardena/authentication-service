const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const Role = require('./role');

const Routes = require('./routes');

module.exports = {

  RoleController: Controller,

  RoleDatabase: Database,

  RoleMiddleware: Middleware,

  RoleRoutes: Routes,

  RoleService: Service,

  Role: Role
};