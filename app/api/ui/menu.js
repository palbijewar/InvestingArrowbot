const defaultMenu = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    linkParent: '/app',
  },
  {
    key: 'profile',
    name: 'Profile',
    icon: 'person',
    child: [
      {
        key: 'view_profile',
        name: 'View Profile',
        icon: 'account_circle',
        link: '/app/pages/user-profile',
      },
      {
        key: 'change_password',
        name: 'Change Password',
        icon: 'lock',
        link: '/app/pages/change-password',
      },
      {
        key: 'wallet_address',
        name: 'Wallet Address',
        icon: 'account_balance_wallet',
        link: '/app/widgets/',
      },
    ],
  },
  {
    key: 'my_network',
    name: 'My Network',
    icon: 'people',
    child: [
      {
        key: 'direct_team',
        name: 'Direct Team',
        icon: 'group',
        link: '/app/widgets/direct-users',
      },
      {
        key: 'downline_team',
        name: 'Downline Team',
        icon: 'device_hub',
        link: '/app/widgets/downline-stream',
      },
    ],
  },
  {
    key: 'fund',
    name: 'Fund',
    icon: 'account_balance',
    child: [
      {
        key: 'sponsor_trading_details',
        name: 'Sponsor Trading Details',
        icon: 'send',
        link: '/app/widgets/sponsor-trading-details',
      },
      {
        key: 'sponsor_trading_history',
        name: 'Sponsor Trading History',
        icon: 'send',
        link: '/app/widgets/sponsor-trading-history',
      },
      {
        key: 'sponsor_trading_history',
        name: 'Sponsor Trading History',
        icon: 'send',
        link: '/app/widgets/sponsor-trading-history',
      },
      {
        key: 'fund_to_gas_history',
        name: 'Fund To Gas History',
        icon: 'history',
        link: '/app/widgets/gas-history',
      },
      {
        key: 'fund_request',
        name: 'Fund Request',
        icon: 'request_quote',
        link: '/app/widgets/request',
      },
    ],
  },
  {
    key: 'withdrawal',
    name: 'Withdrawal',
    icon: 'credit_card',
    child: [
      {
        key: 'portfolio_withdrawal',
        name: 'Portfolio Withdrawal',
        icon: 'account_balance_wallet',
        link: '/app/withdrawal/portfolio',
      },
      {
        key: 'withdrawal_history',
        name: 'Withdrawal History',
        icon: 'history',
        link: '/app/withdrawal/history',
      },
    ],
  },
  {
    key: 'logout',
    name: 'Logout',
    icon: 'exit_to_app',
    linkParent: '/logout',
  },
];

const superAdminMenu = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    linkParent: '/app',
  },
  {
    key: 'profile',
    name: 'Profile',
    icon: 'person',
    child: [
      {
        key: 'view_profile',
        name: 'View Profile',
        icon: 'account_circle',
        link: '/app/pages/user-profile',
      },
      {
        key: 'change_password',
        name: 'Change Password',
        icon: 'lock',
        link: '/app/pages/change-password',
      },
      {
        key: 'wallet_address',
        name: 'Wallet Address',
        icon: 'account_balance_wallet',
        link: '/app/widgets/',
      },
    ],
  },
  {
    key: 'admin_table',
    name: 'Admin Table',
    icon: 'dashboard',
    linkParent: '/app/widgets/admin-table',
  },
  {
    key: 'my_network',
    name: 'My Network',
    icon: 'people',
    child: [
      {
        key: 'direct_team',
        name: 'Direct Team',
        icon: 'group',
        link: '/app/widgets/direct-users',
      },
      {
        key: 'downline_team',
        name: 'Downline Team',
        icon: 'device_hub',
        link: '/app/widgets/downline-stream',
      },
    ],
  },
  {
    key: 'broker_information',
    name: 'Broker Information',
    icon: 'monetization_on',
    linkParent: '/app/widgets/broker-informations',
  },
  {
    key: 'trading_details',
    name: 'Trading Details',
    icon: 'monetization_on',
    linkParent: '/app/widgets/trading-details',
  },
  {
    key: 'fund',
    name: 'Fund',
    icon: 'account_balance',
    child: [
      {
        key: 'sponsor_trading_details',
        name: 'Sponsor Trading Details',
        icon: 'send',
        link: '/app/widgets/sponsor-trading-details',
      },
      {
        key: 'sponsor_trading_history',
        name: 'Sponsor Trading History',
        icon: 'send',
        link: '/app/widgets/sponsor-trading-history',
      },
      {
        key: 'fund_to_gas_wallet',
        name: 'Fund To Gas Wallet',
        icon: 'history',
        link: '/app/widgets/gas-wallet',
      },
      {
        key: 'fund_to_gas_history',
        name: 'Fund To Gas History',
        icon: 'history',
        link: '/app/widgets/gas-wallet-history',
      },
      {
        key: 'fund_request',
        name: 'Fund Request',
        icon: 'request_quote',
        link: '/app/widgets/request',
      },
    ],
  },
  {
    key: 'withdrawal',
    name: 'Withdrawal',
    icon: 'credit_card',
    child: [
      {
        key: 'portfolio_withdrawal',
        name: 'Portfolio Withdrawal',
        icon: 'account_balance_wallet',
        link: '/app/withdrawal/portfolio',
      },
      {
        key: 'withdrawal_history',
        name: 'Withdrawal History',
        icon: 'history',
        link: '/app/withdrawal/history',
      },
    ],
  },
  {
    key: 'logout',
    name: 'Logout',
    icon: 'exit_to_app',
    linkParent: '/logout',
  },
];

const getMenuByUserType = () => {
  const sponsorDetailsRaw = localStorage.getItem('sponsor_details');
  let sponsorDetails = null;

  try {
    sponsorDetails = JSON.parse(sponsorDetailsRaw);
  } catch (err) {
    console.error('Failed to parse sponsor_details from localStorage:', err);
  }
  return sponsorDetails?.user_type === 'superadmin' ? superAdminMenu : defaultMenu;
};

module.exports = getMenuByUserType();
