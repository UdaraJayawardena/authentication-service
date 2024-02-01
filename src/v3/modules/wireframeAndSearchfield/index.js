const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const WireframeAndSearchfield = require('./wireframeAndSearchfield');

const Routes = require('./routes');

module.exports = {

  WireframeAndSearchfieldController: Controller,

  WireframeAndSearchfieldDatabase: Database,

  WireframeAndSearchfieldMiddleware: Middleware,

  WireframeAndSearchfieldRoutes: Routes,

  WireframeAndSearchfieldService: Service,

  WireframeAndSearchfield: WireframeAndSearchfield
};