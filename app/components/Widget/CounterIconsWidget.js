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
import { getPaymentOptions } from '../../middlewares/interceptors';

function CounterIconWidget() {
  const { classes } = useStyles();

  const [paymentOptionCount, setPaymentOptionCount] = useState(0);

  useEffect(() => {
    const fetchPaymentOptions = async () => {
      try {
        const response = await getPaymentOptions();
        setPaymentOptionCount(response?.data?.total_payment_options || 0);
      } catch (error) {
        console.error('Error fetching payment option count', error);
      }
    };
    fetchPaymentOptions();
  }, []);

  return (
    <div className={classes.rootCounterFull}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-dark" start={0} end={paymentOptionCount} duration={3} title="Bot Activation">
            <OndemandVideo className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={0} duration={3} title="Day's Remaining">
            <Assessment className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={0} duration={3} title="Portfolio Investment">
            <BusinessCenter className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={0} duration={3} title="Gas Wallet">
            <AccountBalanceWallet className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-dark" start={0} end={0} duration={3} title="Portfolio Income">
            <MonetizationOn className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={0} duration={3} title="Rank Income">
            <EmojiEvents className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={0} duration={3} title="Level Income">
            <TrendingUp className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={0} duration={3} title="Trading Portfolio">
            <ShowChart className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-dark" start={0} end={0} duration={3} title="Direct Team">
            <Group className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={0} duration={3} title="Downline Team">
            <SupervisorAccount className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={0} duration={3} title="Downline Bot Business">
            <CollectionsBookmark className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={0} duration={3} title="Downline Portfolio Business">
            <BusinessCenter className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={0} duration={3} title="Total Balance">
            <AccountBalanceWallet className={classes.counterIcon} />
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
