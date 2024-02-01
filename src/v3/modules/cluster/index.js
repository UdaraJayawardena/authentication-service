const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const Cluster = require('./cluster');

const Routes = require('./routes');

module.exports = {

  ClusterController: Controller,

  ClusterDatabase: Database,

  ClusterMiddleware: Middleware,

  ClusterRoutes: Routes,

  ClusterService: Service,

  Cluster: Cluster
};