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
        icon: 'visibility',
        link: '/app/pages/user-profile',
      },
      {
        key: 'change_password',
        name: 'Change Password',
        icon: 'vpn_key',
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
        icon: 'person_add',
        link: '/app/widgets/direct-users',
      },
      {
        key: 'downline_team',
        name: 'Downline Team',
        icon: 'share',
        link: '/app/widgets/downline-stream',
      },
    ],
  },
  {
    key: 'trading_details',
    name: 'Trading Details',
    icon: 'show_chart',
    linkParent: '/app/widgets/trading-details',
  },
  {
    key: 'fund',
    name: 'Fund',
    icon: 'account_balance',
    child: [
      {
        key: 'fund_to_gas_wallet',
        name: 'Gas Fees',
        icon: 'local_gas_station',
        link: '/app/widgets/gas-wallet',
      },
      {
        key: 'fund_to_gas_history',
        name: 'Fund To Gas History',
        icon: 'history_toggle_off',
        link: '/app/widgets/gas-history',
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
        icon: 'history_edu',
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
    icon: 'space_dashboard',
    linkParent: '/app',
  },
  {
    key: 'profile',
    name: 'Profile',
    icon: 'face',
    child: [
      {
        key: 'view_profile',
        name: 'View Profile',
        icon: 'visibility',
        link: '/app/pages/user-profile',
      },
      {
        key: 'change_password',
        name: 'Change Password',
        icon: 'vpn_key',
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
    icon: 'table_chart',
    linkParent: '/app/widgets/admin-table',
  },
  {
    key: 'my_network',
    name: 'My Network',
    icon: 'group',
    child: [
      {
        key: 'direct_team',
        name: 'Direct Team',
        icon: 'person_add_alt_1',
        link: '/app/widgets/direct-users',
      },
      {
        key: 'downline_team',
        name: 'Downline Team',
        icon: 'share',
        link: '/app/widgets/downline-stream',
      },
    ],
  },
  {
    key: 'broker_information',
    name: 'Broker Information',
    icon: 'support_agent',
    linkParent: '/app/widgets/broker-informations',
  },
  {
    key: 'trading_details',
    name: 'Trading Details',
    icon: 'show_chart', // chart icon for trading details
    linkParent: '/app/widgets/trading-details',
  },
  {
    key: 'fund',
    name: 'Fund',
    icon: 'savings', // savings icon for fund
    child: [
      {
        key: 'fund_to_gas_wallet',
        name: 'Gas Fees',
        icon: 'local_gas_station', // gas pump icon
        link: '/app/widgets/gas-wallet',
      },
      {
        key: 'fund_to_gas_history',
        name: 'Fund To Gas History',
        icon: 'history_toggle_off', // alternate history icon
        link: '/app/widgets/gas-wallet-history',
      },
    ],
  },
  {
    key: 'sponsor_details',
    name: 'Sponsor Details',
    icon: 'supervisor_account', // supervisor account for sponsors
    child: [
      {
        key: 'sponsor_trading_details',
        name: 'Sponsor Trading Details',
        icon: 'send_and_archive', // send/archive icon
        link: '/app/widgets/sponsor-trading-details',
      },
      {
        key: 'sponsor_trading_history',
        name: 'Sponsor Trading History',
        icon: 'history_edu', // education/history icon variant
        link: '/app/widgets/sponsor-trading-history',
      },
    ],
  },
  {
    key: 'withdrawal',
    name: 'Withdrawal',
    icon: 'payment', // payment icon for withdrawal
    child: [
      {
        key: 'portfolio_withdrawal',
        name: 'Portfolio Withdrawal',
        icon: 'wallet', // wallet icon variant
        link: '/app/withdrawal/portfolio',
      },
      {
        key: 'withdrawal_history',
        name: 'Withdrawal History',
        icon: 'restore', // restore icon for history
        link: '/app/withdrawal/history',
      },
    ],
  },
  {
    key: 'logout',
    name: 'Logout',
    icon: 'logout', // logout icon variant
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
