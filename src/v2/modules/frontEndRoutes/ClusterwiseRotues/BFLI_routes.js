const { Config } = require('../../../../../config');
const FrontEndUrl = Config.FRONTEND_URL;

const LI_Routes = {
  user: [
    {
      name: 'Loan Initaition',
      icon: 'Beenhere',
      rtlName: '',
      layout: '/user',
      hide: false,
      children: [{
        name: 'Loan Request',
        icon: 'Ballot',
        rtlName: '',
        origin: FrontEndUrl.LI_PORTAL_URL,
        layout: '/user',
        hide: false,
        children: [{
          name: 'Customer List',
          icon: 'VideoLabel',
          rtlName: '',
          origin: FrontEndUrl.LI_PORTAL_URL,
          layout: '/user',
          path: '/customer-list',
          component: 'ComingSoon',
          cluster: 'LoanInitiation',
          permission: 'LI-customer-list',
          hide: false,
        }, {
          name: 'Request',
          icon: 'Description',
          rtlName: '',
          origin: FrontEndUrl.LI_PORTAL_URL,
          layout: '/user',
          path: '/startInstance',
          component: 'StartInstance',
          cluster: 'LoanInitiation',
          permission: 'Import loan request',
          hide: false,
        }, {
          name: 'Proposal',
          icon: 'List',
          rtlName: '',
          origin: FrontEndUrl.LI_PORTAL_URL,
          layout: '/user',
          path: '/smeLoanRequestOverview',
          component: 'LoanRequestOverview',
          cluster: 'LoanInitiation',
          permission: 'Loan request overview',
          hide: false,
        }, {
          name: 'SME Details',
          icon: 'Ballot',
          rtlName: '',
          origin: FrontEndUrl.LI_PORTAL_URL,
          layout: '/user',
          path: '/sme-details',
          component: 'ComingSoon',
          cluster: 'LoanInitiation',
          permission: 'LI-sme-details',
          hide: false,
        }, {
          name: 'Contracts',
          icon: 'VideoLabel',
          rtlName: '',
          layout: '/user',
          origin: FrontEndUrl.LI_PORTAL_URL,
          path: '/contract-overview',
          component: 'ContractOverviewNew',
          cluster: 'LoanInitiation',
          permission: 'Contract overview',
          hide: false,
        }]
      }, {
        name: 'Credit Risk',
        icon: 'VideoLabel',
        rtlName: '',
        layout: '/user',
        hide: false,
        children: [{
          name: 'Customer List',
          icon: 'Ballot',
          rtlName: '',
          origin: FrontEndUrl.LI_PORTAL_URL,
          layout: '/user',
          path: '/customer-list',
          component: 'ComingSoon',
          cluster: 'LoanInitiation',
          permission: 'LI-customer-list',
          hide: false,
        }, {
          name: 'Dashboard',
          icon: 'VideoLabel',
          rtlName: '',
          origin: FrontEndUrl.LI_PORTAL_URL,
          layout: '/user',
          path: '/li-dashboard',
          component: 'DashboardPage',
          cluster: 'LoanInitiation',
          permission: 'Dashboard',
          hide: false,
        }, {
          name: 'Categories',
          icon: 'Ballot',
          rtlName: '',
          origin: FrontEndUrl.LI_PORTAL_URL,
          layout: '/user',
          path: '/categories',
          component: 'ComingSoon',
          cluster: 'LoanInitiation',
          permission: 'LI-categories',
          hide: false,
        }, {
          name: 'Parameters',
          icon: 'ChromeReaderMode',
          rtlName: '',
          origin: FrontEndUrl.LI_PORTAL_URL,
          layout: '/user',
          path: '/parameters',
          component: 'PlatformOverview',
          cluster: 'LoanInitiation',
          permission: 'Platform overview',
          hide: false,
        }, {
          name: 'Category Rules',
          icon: 'Category',
          rtlName: '',
          origin: FrontEndUrl.LI_PORTAL_URL,
          layout: '/user',
          path: '/category-rules',
          component: 'CategoryRules',
          cluster: 'LoanInitiation',
          permission: 'Category Rules',
          hide: false,
        }, {
          name: 'SME Details',
          icon: 'VideoLabel',
          rtlName: '',
          origin: FrontEndUrl.LI_PORTAL_URL,
          layout: '/user',
          path: '/sme-details',
          component: 'ComingSoon',
          cluster: 'LoanInitiation',
          permission: 'LI-sme-details',
          hide: false,
        },
        {
          name: 'Internal Debt Form',
          icon: 'Ballot',
          rtlName: '',
          origin: FrontEndUrl.LI_PORTAL_URL,
          layout: '/user',
          path: '/debt-form-overview',
          component: 'DebtFormOverview',
          cluster: 'LoanInitiation',
          permission: 'Internal Debt Form',
          hide: true,
        }]
      }, {
        name: 'Business Support',
        icon: 'Ballot',
        rtlName: '',
        layout: '/user',
        hide: false,
        children: [{
          name: 'Customer List',
          icon: 'VideoLabel',
          rtlName: '',
          origin: FrontEndUrl.LI_PORTAL_URL,
          layout: '/user',
          path: '/customer-list',
          component: 'ComingSoon',
          cluster: 'LoanInitiation',
          permission: 'LI-customer-list',
          hide: false,
        }]
      },
      {
        name: 'Process Dashboard',
        icon: 'SettingsApplications',
        rtlName: '',
        origin: FrontEndUrl.LI_PORTAL_URL,
        layout: '/user',
        path: '/ProcessDashboard',
        component: 'ProcessDashboard',
        cluster: 'LoanInitiation',
        permission: 'LI-process-dashboard',
        hide: false
      },
      {
        name: 'BAI Overview',
        icon: 'Ballot',
        rtlName: '',
        origin: FrontEndUrl.LI_PORTAL_URL,
        layout: '/user',
        path: '/BAIOverview',
        component: 'BAIOverview',
        cluster: 'LoanInitiation',
        permission: 'BAI Overview',
        hide: false,
      }, {
        name: 'Workflow Management',
        icon: 'Work',
        rtlName: '',
        origin: FrontEndUrl.LI_PORTAL_URL,
        layout: '/user',
        path: '/workflow-overview',
        component: 'WorkflowManagement',
        cluster: 'LoanInitiation',
        hide: false,
      },
      {
        name: 'Single Account Overview',
        icon: 'Ballot',
        rtlName: '',
        origin: FrontEndUrl.LI_PORTAL_URL,
        layout: '/user',
        path: '/single-account-overview',
        component: 'SingleAccountOverview',
        cluster: 'LoanInitiation',
        hide: false,
        permission: 'Single account overview'
      }]
    }],
  admin: [{
    name: 'Loan Initaition',
    icon: 'Beenhere',
    rtlName: '',
    layout: '/admin',
    hide: false,
    children: [{
      name: 'Admin Dashboard',
      rtlName: '',
      icon: 'Dashboard',
      origin: FrontEndUrl.LI_PORTAL_URL,
      layout: '/admin',
      path: '/dashboard',
      component: 'AdminDashboard',
      cluster: 'LoanInitiation',
      permission: 'LI-admin-dashboard',
      hide: false,
    }, {
      name: 'Parameter Dashboard',
      rtlName: '',
      icon: 'Dashboard',
      origin: FrontEndUrl.LI_PORTAL_URL,
      layout: '/admin',
      path: '/parameterDashboard',
      component: 'ParameterDashboard',
      cluster: 'LoanInitiation',
      hide: false,
      permission: 'Parameter Dashboard'
    }, {
      name: 'Bank Overview',
      rtlName: '',
      icon: 'AccountBalance',
      origin: FrontEndUrl.LI_PORTAL_URL,
      layout: '/admin',
      path: '/banksOverview',
      component: 'BanksOverview',
      cluster: 'LoanInitiation',
      hide: true,
      permission: 'Bank overview'
    },
    {
      name: 'Platform Overview',
      icon: 'ChromeReaderMode',
      rtlName: '',
      origin: FrontEndUrl.LI_PORTAL_URL,
      component: 'PlatformOverview',
      cluster: 'LoanInitiation',
      layout: '/admin',
      path: '/platformOverview',
      hide: true,
      permission: 'Platform Overview',
    },
    {
      name: 'Bank Transaction Type Overview',
      icon: 'ListAlt',
      rtlName: '',
      origin: FrontEndUrl.LI_PORTAL_URL,
      component: 'BankTransactionTypeOverview',
      cluster: 'LoanInitiation',
      layout: '/admin',
      path: '/bankTransactionTypeOverview',
      hide: true,
      permission: 'Bank transaction type overview',
    }]
  }]
};

module.exports = [].concat(LI_Routes.user, LI_Routes.admin);
