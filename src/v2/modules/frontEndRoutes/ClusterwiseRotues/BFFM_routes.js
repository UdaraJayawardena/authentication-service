const { Config } = require('../../../../../config');
const FrontEndUrl = Config.FRONTEND_URL;

const FM_Routes = {
  user: [{
    name: 'Dashboard',
    icon: 'Dashboard',
    rtlName: '',
    origin: FrontEndUrl.BFFM_PORTAL_URL,
    layout: '/user',
    path: '/dashboard',
    component: 'DashboardPage',
    cluster: 'FunderManagement',
    permission: 'FM-dashboard',
    hide: false
  }, {
    name: 'Customers',
    icon: 'SupervisedUserCircle',
    rtlName: '',
    origin: FrontEndUrl.BFFM_PORTAL_URL,
    layout: '/user',
    path: '/customers',
    component: 'Customers',
    cluster: 'FunderManagement',
    permission: 'FM-customers',
    hide: false
  }, {
    name: 'Add Customers',
    icon: 'SupervisedUserCircle',
    rtlName: '',
    origin: FrontEndUrl.BFFM_PORTAL_URL,
    layout: '/user',
    path: '/addCustomer',
    component: 'AddStakeholder',
    cluster: 'FunderManagement',
    permission: 'FM-add-customer',
    hide: true
  }, {
    name: 'Funder Loan',
    icon: 'AddToPhotos',
    rtlName: '',
    origin: FrontEndUrl.BFFM_PORTAL_URL,
    layout: '/user',
    path: '/funderLoan',
    component: 'AddFunderLoan',
    cluster: 'FunderManagement',
    permission: 'FM-funder-loan',
    hide: false
  }, {
    name: 'Multiple Funder Loan Overview',
    icon: 'Assignment',
    rtlName: '',
    origin: FrontEndUrl.BFFM_PORTAL_URL,
    layout: '/user',
    path: '/multipleFunderLoanOverview',
    component: 'MultipleFunderLoanOverview',
    cluster: 'FunderManagement',
    permission: 'FM-multiple-funder-loan-overview',
    hide: false
  }, {
    name: 'Customers',
    icon: 'SupervisedUserCircle',
    rtlName: '',
    origin: FrontEndUrl.BFFM_PORTAL_URL,
    layout: '/user',
    path: '/viewCustomer',
    component: 'SingleCustomerView',
    cluster: 'FunderManagement',
    permission: 'FM-customers',
    hide: true
  }, {
    name: 'Single Loan Overview',
    icon: 'Description',
    rtlName: '',
    origin: FrontEndUrl.BFFM_PORTAL_URL,
    layout: '/user',
    path: '/singleLoanOverview',
    component: 'SingleFunderLoanOverview_1',
    cluster: 'FunderManagement',
    permission: 'FM-single-loan-overview',
    hide: true
  },
  {
    name: 'Loan Redemptions Overview',
    icon: 'MoneyOff',
    rtlName: '',
    origin: FrontEndUrl.BFFM_PORTAL_URL,
    layout: '/user',
    path: '/redemptionOrdersOverview',
    component: 'RedemptionOrdersOverview',
    cluster: 'FunderManagement',
    permission: 'FM-loan-redemption-overview',
    hide: false
  },
  {
    name: 'Funder Transaction Overview',
    icon: 'AccountBalance',
    rtlName: '',
    origin: FrontEndUrl.BFFM_PORTAL_URL,
    layout: '/user',
    path: '/multipleFunderTransactionOverview',
    component: 'MultipleFunderTransactionOverview',
    cluster: 'FunderManagement',
    permission: 'FM-MultipleFunderTransactionOverview',
    hide: false
  }, {
    name: 'Bank Transaction Overview',
    icon: 'Money',
    rtlName: '',
    origin: FrontEndUrl.BFFM_PORTAL_URL,
    layout: '/user',
    path: '/bankTransactionOverview',
    component: 'BankTransactionOverview',
    cluster: 'FunderManagement',
    permission: 'FM-bank-transaction-overview',
    hide: false
  },
  {
    name: 'Liquidity Overview',
    icon: 'Equalizer',
    rtlName: '',
    origin: FrontEndUrl.BFFM_PORTAL_URL,
    layout: '/user',
    path: '/liquidityOverview',
    component: 'LiquidityOverview',
    cluster: 'FunderManagement',
    permission: 'FM-liquidity-overview',
    hide: false
  },
  {
    name: 'Book Funder Interest Costs',
    icon: 'Note',
    rtlName: '',
    origin: FrontEndUrl.BFFM_PORTAL_URL,
    layout: '/user',
    path: '/BookFunderInterestCosts',
    component: 'BookFunderInterestCosts',
    cluster: 'FunderManagement',
    permission: 'FM-BookFunderInterestCosts',
    hide: false
  }],
  admin: [{
    name: 'Interest Conditions Overview',
    icon: 'AttachMoney',
    rtlName: '',
    origin: FrontEndUrl.BFFM_PORTAL_URL,
    layout: '/admin',
    path: '/interestConditionsOverview',
    component: 'InterestConditionOverview',
    cluster: 'FunderManagement',
    permission: 'FM-interest-conditions-overview',
    hide: false
  }, {
    name: 'Yearly statement',
    icon: 'Assignment',
    rtlName: '',
    origin: FrontEndUrl.BFFM_PORTAL_URL,
    layout: '/admin',
    path: '/tests',
    component: 'Tests',
    cluster: 'FunderManagement',
    permission: 'FM-yearly-statements',
    hide: Config.APPLICATION.IS_NOT_PROD ? false : true
  },]
};

module.exports = [].concat(FM_Routes.user, FM_Routes.admin);
