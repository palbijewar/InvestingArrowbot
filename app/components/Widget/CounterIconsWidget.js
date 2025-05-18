import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import OndemandVideo from '@mui/icons-material/OndemandVideo';
import SupervisorAccount from '@mui/icons-material/SupervisorAccount';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Assessment from '@mui/icons-material/Assessment';
import Group from '@mui/icons-material/Group';
import BusinessCenter from '@mui/icons-material/BusinessCenter';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import { injectIntl } from 'react-intl';
import CounterWidget from '../Counter/CounterWidget';
import useStyles from './widget-jss';
import {
  getRankInformations,
  getSecondLevelReferralsTotalIncome,
  getTotalDownlineTeamCount,
  getDirectTeamCount,
  getDirectPortfolioInvestment,
  getDownlinePortfolioInvestment,
  getBotDirectPortfolioInvestment,
  getBotDownlinePortfolioInvestment,
  getBotDirectActivationCount,
  getBotDownlineActivationCount,
} from '../../middlewares/interceptors';

function CounterIconWidget() {
  const { classes } = useStyles();
  const [directTeamCount, setDirectTeamCount] = useState(0);
  const [downlineTeamCount, setDownlineTeamCount] = useState(0);
  const [directPortfolioInvestment, setDirectPortfolioInvestment] = useState(0);
  const [downlinePortfolioInvestment, setDownlinePortfolioInvestment] = useState(0);
  const [directBotAtivation, setDirectBotAtivation] = useState(0);
  const [downlineBotAtivation, setBotAtivation] = useState(0);
  const [directBotBusiness, setDirectBotBusiness] = useState(0);
  const [downlineBotBusiness, setDownlineBotBusiness] = useState(0);
  const [levelIncome, setLevelIncome] = useState(0);
  const [currentRank, setCurrentRank] = useState(0);
  const [rankIncome, setRankIncome] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const sponsorDetails = JSON.parse(localStorage.getItem('sponsor_details'));
        const sponsorId = sponsorDetails?.sponsor_id;

        const [
          directTeamCountResponse,
          downlineTeamCountResponse,
          directPortfolioInvestmentResponse,
          downlinePortfolioInvestmentResponse,
          botDirectPortfolioInvestmentResponse,
          botDownlinePortfolioInvestmentResponse,
          botDirectBotActivationResponse,
          botDownlineBotActivationResponse,
          levelIncomeResponse,
          rankInformationsResponse
        ] = await Promise.all([
          getDirectTeamCount(sponsorId),
          getTotalDownlineTeamCount(sponsorId),
          getDirectPortfolioInvestment(sponsorId),
          getDownlinePortfolioInvestment(sponsorId),
          getBotDirectPortfolioInvestment(sponsorId),
          getBotDownlinePortfolioInvestment(sponsorId),
          getBotDirectActivationCount(sponsorId),
          getBotDownlineActivationCount(sponsorId),
          getSecondLevelReferralsTotalIncome(sponsorId),
          getRankInformations(sponsorId),
        ]);

        setDirectTeamCount(directTeamCountResponse?.data?.count || 0);
        setDownlineTeamCount(downlineTeamCountResponse?.data?.count || 0);

        setDirectPortfolioInvestment(directPortfolioInvestmentResponse?.data?.direct_portfolio_investment || 0);

        setDownlinePortfolioInvestment(downlinePortfolioInvestmentResponse?.data?.downline_portfolio_investment || 0);
        setDirectBotBusiness(botDirectPortfolioInvestmentResponse?.data?.direct_bot_income || 0);
        setDownlineBotBusiness(botDownlinePortfolioInvestmentResponse?.data?.downline_bot_income || 0);
        setDirectBotAtivation(botDirectBotActivationResponse?.data?.direct_bot_count || 0);
        setBotAtivation(botDownlineBotActivationResponse?.data?.downline_bot_count || 0);
        setLevelIncome(levelIncomeResponse?.data?.level_income || 0);
        setCurrentRank(rankInformationsResponse?.data?.rank || '');
        setRankIncome(rankInformationsResponse?.data?.income || 0);
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
          <CounterWidget color="secondary-dark" start={0} end={directBotAtivation} duration={3} title="Direct Bot Activation">
            <OndemandVideo className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-dark" start={0} end={directBotBusiness} duration={3} title="Direct Bot Business">
            <OndemandVideo className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={downlineBotAtivation} duration={3} title="Downline Bot Activation">
            <Assessment className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={downlineBotBusiness} duration={3} title="Downline Bot Business">
            <Assessment className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget
            color="secondary-main"
            start={0}
            end={directPortfolioInvestment}
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
            end={downlinePortfolioInvestment}
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
          <CounterWidget color="secondary-dark" start={0} end={0} duration={3} title="Downline Portfolio Income">
            <MonetizationOn className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={rankIncome} duration={3} title="Rank Income">
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
          <CounterWidget color="secondary-main" start={0} end={currentRank} duration={3} title="Current Rank">
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
