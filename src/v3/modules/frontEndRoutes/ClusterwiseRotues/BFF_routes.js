const { Config } = require('../../../../../config');
const FrontEndUrl = Config.FRONTEND_URL;

const BFF_Routes = {
  user: [{
    name: 'Dashboard',
    icon: 'Dashboard',
    rtlName: '',
    origin: FrontEndUrl.BFF_PORTAL_URL,
    layout: '/user',
    path: '/dashboard',
    component: 'DashboardPage',
    cluster: 'FoundationManagement',
    permission: 'BFF-dashboard',
    hide: false
  }, {
    name: 'Unknown Bank Transactions',
    icon: 'QueuePlayNext',
    rtlName: '',
    origin: FrontEndUrl.BFF_PORTAL_URL,
    layout: '/user',
    path: '/processUnknownBankTransactions',
    component: 'ProcessUnknownBankTransactions',
    cluster: 'FoundationManagement',
    permission: 'BFF-unknown-bank-transactions',
    hide: false
  }, {
    name: 'Payment Orders Overview',
    icon: 'AttachMoney',
    rtlName: '',
    origin: FrontEndUrl.BFF_PORTAL_URL,
    layout: '/user',
    path: '/paymentOrderOverview',
    component: 'PaymentOrderOverview',
    cluster: 'FoundationManagement',
    permission: 'BFF-payment-orders-overview',
    hide: false
  }, {
    name: 'Log Overview',
    icon: 'NotificationImportant',
    rtlName: '',
    origin: FrontEndUrl.BFF_PORTAL_URL,
    layout: '/user',
    path: '/logOverview',
    component: 'LogOverview',
    cluster: 'FoundationManagement',
    permission: 'BFF-log-overview',
    hide: false
  }],
  admin: [{
    name: 'Scheduled Tasks',
    icon: 'EventNote',
    rtlName: '',
    origin: FrontEndUrl.BFF_PORTAL_URL,
    layout: '/admin',
    path: '/scheduledTasksConfigurations',
    component: 'ScheduledTasksOverview',
    cluster: 'FoundationManagement',
    permission: 'BFF-scheduled-tasks',
    hide: false
  }, {
    name: 'Configurations',
    icon: 'Settings',
    rtlName: '',
    origin: FrontEndUrl.BFF_PORTAL_URL,
    layout: '/admin',
    path: '/Configurations',
    component: 'ConfigurationsOverview',
    cluster: 'FoundationManagement',
    permission: 'BFF-configurations',
    hide: false
  }, {
    name: 'User Management',
    icon: 'AccountCircle',
    rtlName: '',
    origin: FrontEndUrl.BFF_PORTAL_URL,
    layout: '/admin',
    path: '/UserManagement',
    component: 'UserManagement',
    cluster: 'FoundationManagement',
    permission: 'BFF-user-management',
    hide: false
  }, {
    name: 'Permission Matrixs',
    icon: 'CallToAction',
    rtlName: '',
    origin: FrontEndUrl.BFF_PORTAL_URL,
    layout: '/admin',
    path: '/PermissionMatrixs',
    component: 'PermissionMatrixOverview',
    cluster: 'FoundationManagement',
    permission: 'BFF-permission-matrix',
    hide: false
  }, {
    name: 'Permission Upload',
    icon: 'Backup',
    rtlName: '',
    origin: FrontEndUrl.BFF_PORTAL_URL,
    layout: '/admin',
    path: '/PermissionMatrixUpload',
    component: 'PermissionMatrixUpload',
    cluster: 'FoundationManagement',
    permission: 'BFF-permission-upload',
    hide: false
  },
  {
    name: 'Field Name Value Overview',
    icon: 'EventNote',
    rtlName: '',
    origin: FrontEndUrl.BFF_PORTAL_URL,
    layout: '/admin',
    path: '/FieldNameValueOverview',
    component: 'FieldNameValueOverview',
    cluster: 'FoundationManagement',
    permission: 'BFF-field-name-value-overview',
    hide: false
  },
  {
    name: 'Dashboard Creation Overview',
    icon: 'CallToAction',
    rtlName: '',
    origin: FrontEndUrl.BFF_PORTAL_URL,
    layout: '/admin',
    path: '/DashboardCreation',
    component: 'DashboardCreation',
    cluster: 'FoundationManagement',
    permission: 'BFF-dashboard-creation-overview',
    // permission: 'BFF-field-name-value-overview',
    hide: false
  }


  ]
};

module.exports = [].concat(BFF_Routes.user, BFF_Routes.admin);
