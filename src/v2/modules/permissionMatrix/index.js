const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const PermissionMatrix = require('./permissionMatrix');

const Routes = require('./routes');

module.exports = {

  PermissionMatrixController: Controller,

  PermissionMatrixDatabase: Database,

  PermissionMatrixMiddleware: Middleware,

  PermissionMatrixRoutes: Routes,

  PermissionMatrixService: Service,

  PermissionMatrix: PermissionMatrix
};