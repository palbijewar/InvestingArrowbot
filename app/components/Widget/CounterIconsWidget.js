import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import OndemandVideo from '@mui/icons-material/OndemandVideo';
import SupervisorAccount from '@mui/icons-material/SupervisorAccount';
import CollectionsBookmark from '@mui/icons-material/CollectionsBookmark';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Assessment from '@mui/icons-material/Assessment';
import Group from '@mui/icons-material/Group';
import BusinessCenter from '@mui/icons-material/BusinessCenter';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import ShowChart from '@mui/icons-material/ShowChart';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import { injectIntl } from 'react-intl';
import CounterWidget from '../Counter/CounterWidget';
import useStyles from './widget-jss';
import {
  getPaymentOptions,
  getTotalDematFund,
  getDirectReferrals,
  getSecondLevelReferrals,
  getSecondLevelReferralsTotalIncome
} from '../../middlewares/interceptors';

function CounterIconWidget() {
  const { classes } = useStyles();
  const [directTeamCount, setDirectTeamCount] = useState(0);
  const [downlineTeamCount, setDownlineTeamCount] = useState(0);
  const [levelIncome, setLevelIncome] = useState(0);
  const [totalDownlineIncome, setTotalDownlineIncome] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const sponsorDetails = JSON.parse(localStorage.getItem('sponsor_details'));
        const sponsorId = sponsorDetails?.sponsor_id;

        const [
          directResponse,
          secondLevelResponse,
          levelIncomeResponse
        ] = await Promise.all([
          getPaymentOptions(),
          getTotalDematFund(),
          getDirectReferrals(sponsorId),
          getSecondLevelReferrals(sponsorId),
          getSecondLevelReferralsTotalIncome(sponsorId)
        ]);

        const directReferrals = directResponse?.data || [];
        const secondLevelReferrals = secondLevelResponse?.data || [];

        setDirectTeamCount(directReferrals.length);
        setDownlineTeamCount(secondLevelReferrals.length);

        const totalIncome = levelIncomeResponse?.data?.total_income || 0;
        setLevelIncome(totalIncome);

        const downlineIncome = secondLevelReferrals.reduce(
          (sum, user) => sum + (Number(user.package) || 0),
          0
        );
        setTotalDownlineIncome(downlineIncome);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className={classes.rootCounterFull}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-dark" start={0} end={0} duration={3} title="Direct Bot Activation">
            <OndemandVideo className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-dark" start={0} end={0} duration={3} title="Direct Bot Business">
            <OndemandVideo className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={0} duration={3} title="Downline Bot Activation">
            <Assessment className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={0} duration={3} title="Downline Bot Business">
            <Assessment className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget
            color="secondary-main"
            start={0}
            end={0}
            duration={3}
            title="Direct Portfolio Investment"
          >
            <BusinessCenter className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget
            color="secondary-main"
            start={0}
            end={0}
            duration={3}
            title="Downline Portfolio Investment"
          >
            <BusinessCenter className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-dark" start={0} end={0} duration={3} title="Direct Portfolio Income">
            <MonetizationOn className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-dark" start={0} end={totalDownlineIncome} duration={3} title="Downline Portfolio Income">
            <MonetizationOn className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={0} duration={3} title="Rank Income">
            <EmojiEvents className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={levelIncome} duration={3} title="Level Income">
            <TrendingUp className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-dark" start={0} end={directTeamCount} duration={3} title="Direct Team">
            <Group className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={downlineTeamCount} duration={3} title="Downline Team">
            <SupervisorAccount className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={0} duration={3} title="Current Rank">
            <EmojiEvents className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
      </Grid>
    </div>
  );
}

CounterIconWidget.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(CounterIconWidget);
