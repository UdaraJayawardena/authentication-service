const Controller = require('./controller');

const Database = require('./database');

const Middleware = require('./middleware');

const Service = require('./service');

const MyDashboardItem = require('./myDashboardItem');

const Routes = require('./routes');

module.exports = {

  MyDashboardItemController: Controller,

  MyDashboardItemDatabase: Database,

  MyDashboardItemMiddleware: Middleware,

  MyDashboardItemRoutes: Routes,

  MyDashboardItemService: Service,

  MyDashboardItem: MyDashboardItem
};