const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const DashboardItem = require('./dashboardItem');

const Routes = require('./routes');

module.exports = {

  DashboardItemController: Controller,

  DashboardItemDatabase: Database,

  DashboardItemMiddleware: Middleware,

  DashboardItemRoutes: Routes,

  DashboardItemService: Service,

  DashboardItem: DashboardItem
};