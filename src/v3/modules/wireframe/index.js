const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const Wireframe = require('./wireframe');

const Routes = require('./routes');

module.exports = {

  WireframeController: Controller,

  WireframeDatabase: Database,

  WireframeMiddleware: Middleware,

  WireframeRoutes: Routes,

  WireframeService: Service,

  Wireframe: Wireframe
};