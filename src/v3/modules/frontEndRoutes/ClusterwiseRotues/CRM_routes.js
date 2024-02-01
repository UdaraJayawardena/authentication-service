const { Config } = require('../../../../../config');
const FrontEndUrl = Config.FRONTEND_URL;

const CRM_Routes = {
  user: [{
    name: 'CRM',
    icon: 'Person',
    rtlName: '',
    layout: '/user',
    hide: false,
    children: [{
      name: 'Customer List',
      icon: 'SupervisedUserCircle',
      rtlName: '',
      origin: FrontEndUrl.CRM_PORTAL_URL,
      layout: '/user',
      path: '/listOfCustomers',
      component: 'SmeList',
      cluster: 'CRM',
      permission: 'CRM-customer-list',
      hide: false,
    }, {
      name: 'Customer Overview',
      icon: 'AccountCircle',
      rtlName: '',
      origin: FrontEndUrl.CRM_PORTAL_URL,
      layout: '/user',
      path: '/customerOverview',
      component: 'SmeOverview',
      cluster: 'CRM',
      permission: 'CRM-custoemr-overview',
      hide: false,
    }, {
      name: 'Corresponnce',
      icon: 'VideoLabel',
      rtlName: '',
      origin: FrontEndUrl.CRM_PORTAL_URL,
      layout: '/user',
      path: '/corresponnce',
      component: 'ComingSoon',
      cluster: 'CRM',
      hide: false,
      permission: 'CRM-corresponnce'
    }, {
      name: 'New Task',
      icon: 'Ballot',
      rtlName: '',
      origin: FrontEndUrl.CRM_PORTAL_URL,
      layout: '/user',
      path: '/new-task',
      component: 'ComingSoon',
      cluster: 'CRM',
      permission: 'CRM-new-task',
      hide: false,
    }, {
      name: 'Memo Overview',
      icon: '',
      rtlName: '',
      origin: FrontEndUrl.CRM_PORTAL_URL,
      layout: '/user',
      path: '/memoOverview',
      component: 'MemoOverview',
      cluster: 'CRM',
      permission: 'CRM-memo-overview',
      hide: true,
    }],
  }],
  admin: [{
    name: 'CRM',
    icon: 'Person',
    rtlName: '',
    layout: '/admin',
    hide: false,
    children: [{
      name: 'Admin Dashboard',
      icon: 'Dashboard',
      rtlName: '',
      origin: FrontEndUrl.CRM_PORTAL_URL,
      layout: '/admin',
      path: '/dashboard',
      component: 'AdminDashboard',
      cluster: 'CRM',
      permission: 'CRM-admin-dashboard',
      hide: false
    }]
  }]
};

module.exports = [].concat(CRM_Routes.user, CRM_Routes.admin);
