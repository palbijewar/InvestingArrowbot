import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';

// Icons
import SmartToy from '@mui/icons-material/SmartToy';
import PrecisionManufacturing from '@mui/icons-material/PrecisionManufacturing';
import GroupAdd from '@mui/icons-material/GroupAdd';
import Groups3 from '@mui/icons-material/Groups3';
import LocalAtm from '@mui/icons-material/LocalAtm';
import AccountBalance from '@mui/icons-material/AccountBalance';
import Paid from '@mui/icons-material/Paid';
import Savings from '@mui/icons-material/Savings';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Diversity1 from '@mui/icons-material/Diversity1';
import SupervisorAccount from '@mui/icons-material/SupervisorAccount';
import MilitaryTech from '@mui/icons-material/MilitaryTech';

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
  getProfitSummary,
  getSponsorProfitDetails,
  getGasWalletTortalFundBySponsorId,
} from '../../middlewares/interceptors';

function CounterIconWidget() {
  const { classes } = useStyles();

  const [loading, setLoading] = useState(true);

  const [directTeamCount, setDirectTeamCount] = useState(0);
  const [downlineTeamCount, setDownlineTeamCount] = useState(0);
  const [directPortfolioInvestment, setDirectPortfolioInvestment] = useState(0);
  const [downlinePortfolioInvestment, setDownlinePortfolioInvestment] = useState(0);
  const [directBotAtivation, setDirectBotAtivation] = useState(0);
  const [downlineBotAtivation, setBotAtivation] = useState(0);
  const [directBotBusiness, setDirectBotBusiness] = useState(0);
  const [downlineBotBusiness, setDownlineBotBusiness] = useState(0);
  const [levelIncome, setLevelIncome] = useState(0);
  const [currentRank, setCurrentRank] = useState('');
  const [rankIncome, setRankIncome] = useState(0);
  const [directPortfolioIncome, setDirectPortfolioIncome] = useState(0);
  const [downlinePortfolioIncome, setDownlinePortfolioIncome] = useState(0);
  const [gasWalletFund, setGasWalletFund] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const sponsorDetails = JSON.parse(localStorage.getItem('sponsor_details'));
        const sponsorId = sponsorDetails?.sponsor_id;

        const time = async (label, fn) => {
          const start = performance.now();
          const result = await fn();
          console.log(`${label} took ${(performance.now() - start).toFixed(2)} ms`);
          return result;
        };

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
          rankInformationsResponse,
          profitSummaryResponse,
          gasWalletTortalFundBySponsorIdResponse,
        ] = await Promise.all([
          time('Direct Team Count', () => getDirectTeamCount(sponsorId)),
          time('Downline Team Count', () => getTotalDownlineTeamCount(sponsorId)),
          time('Direct Portfolio Investment', () => getDirectPortfolioInvestment(sponsorId)),
          time('Downline Portfolio Investment', () => getDownlinePortfolioInvestment(sponsorId)),
          time('Bot Direct Portfolio', () => getBotDirectPortfolioInvestment(sponsorId)),
          time('Bot Downline Portfolio', () => getBotDownlinePortfolioInvestment(sponsorId)),
          time('Bot Direct Activation', () => getBotDirectActivationCount(sponsorId)),
          time('Bot Downline Activation', () => getBotDownlineActivationCount(sponsorId)),
          time('Level Income', () => getSecondLevelReferralsTotalIncome(sponsorId)),
          time('Rank Information', () => getRankInformations(sponsorId)),
          time('Profit Summary', () => getSponsorProfitDetails(sponsorId)),
          time('Gas Wallet', () => getGasWalletTortalFundBySponsorId(sponsorId)),
        ]);

        setDirectTeamCount(directTeamCountResponse?.data?.count || 0);
        setDownlineTeamCount(downlineTeamCountResponse?.data?.count || 0);
        setDirectPortfolioInvestment(directPortfolioInvestmentResponse?.data?.direct_portfolio_investment || 0);
        setDownlinePortfolioInvestment(downlinePortfolioInvestmentResponse?.data?.downline_portfolio_investment || 0);
        setDirectBotBusiness(botDirectPortfolioInvestmentResponse?.data?.direct_bot_income || 0);
        setDownlineBotBusiness(botDownlinePortfolioInvestmentResponse?.data?.downline_bot_income || 0);
        setDirectBotAtivation(botDirectBotActivationResponse?.data?.direct_bot_count || 0);
        setBotAtivation(botDownlineBotActivationResponse?.data?.downline_bot_count || 0);
        setLevelIncome(profitSummaryResponse?.totalIncome || 0);
        setCurrentRank(rankInformationsResponse?.data?.rank || '');
        setRankIncome(rankInformationsResponse?.data?.income || 0);
        setDirectPortfolioIncome(profitSummaryResponse?.totalDirectIncome || 0);
        setDownlinePortfolioIncome(profitSummaryResponse?.totalDownlineIncome || 0);
        setGasWalletFund(gasWalletTortalFundBySponsorIdResponse?.data?.totalGasWalletFund || 0);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className={classes.rootCounterFull} style={{ textAlign: 'center', padding: '40px' }}>
        <CircularProgress size={48} />
      </div>
    );
  }

  return (
    <div className={classes.rootCounterFull}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}><CounterWidget color="secondary-dark" start={0} end={directBotAtivation} duration={3} title="Direct Bot Activation"><SmartToy className={classes.counterIcon} /></CounterWidget></Grid>
        <Grid item xs={6} md={3}><CounterWidget color="secondary-dark" start={0} end={directBotBusiness} duration={3} title="Direct Bot Business"><PrecisionManufacturing className={classes.counterIcon} /></CounterWidget></Grid>
        <Grid item xs={6} md={3}><CounterWidget color="secondary-main" start={0} end={downlineBotAtivation} duration={3} title="Downline Bot Activation"><GroupAdd className={classes.counterIcon} /></CounterWidget></Grid>
        <Grid item xs={6} md={3}><CounterWidget color="secondary-main" start={0} end={downlineBotBusiness} duration={3} title="Downline Bot Business"><Groups3 className={classes.counterIcon} /></CounterWidget></Grid>
        <Grid item xs={6} md={3}><CounterWidget color="secondary-main" start={0} end={directPortfolioInvestment} duration={3} title="Direct Portfolio Investment"><LocalAtm className={classes.counterIcon} /></CounterWidget></Grid>
        <Grid item xs={6} md={3}><CounterWidget color="secondary-main" start={0} end={downlinePortfolioInvestment} duration={3} title="Downline Portfolio Investment"><AccountBalance className={classes.counterIcon} /></CounterWidget></Grid>
        <Grid item xs={6} md={3}><CounterWidget color="secondary-dark" start={0} end={directPortfolioIncome} duration={3} title="Direct Portfolio Income"><Paid className={classes.counterIcon} /></CounterWidget></Grid>
        <Grid item xs={6} md={3}><CounterWidget color="secondary-dark" start={0} end={downlinePortfolioIncome} duration={3} title="Downline Portfolio Income"><Savings className={classes.counterIcon} /></CounterWidget></Grid>
        <Grid item xs={6} md={3}><CounterWidget color="secondary-main" start={0} end={rankIncome} duration={3} title="Rank Income"><EmojiEvents className={classes.counterIcon} /></CounterWidget></Grid>
        <Grid item xs={6} md={3}><CounterWidget color="secondary-main" start={0} end={levelIncome} duration={3} title="Level Income"><TrendingUp className={classes.counterIcon} /></CounterWidget></Grid>
        <Grid item xs={6} md={3}><CounterWidget color="secondary-dark" start={0} end={directTeamCount} duration={3} title="Direct Team"><Diversity1 className={classes.counterIcon} /></CounterWidget></Grid>
        <Grid item xs={6} md={3}><CounterWidget color="secondary-main" start={0} end={downlineTeamCount} duration={3} title="Downline Team"><SupervisorAccount className={classes.counterIcon} /></CounterWidget></Grid>
        <Grid item xs={6} md={3}><CounterWidget color="secondary-main" start={0} end={currentRank} duration={3} title="Current Rank"><MilitaryTech className={classes.counterIcon} /></CounterWidget></Grid>
        <Grid item xs={6} md={3}><CounterWidget color="secondary-main" start={0} end={gasWalletFund} duration={3} title="Gas Wallet Fund"><MilitaryTech className={classes.counterIcon} /></CounterWidget></Grid>
      </Grid>
    </div>
  );
}

CounterIconWidget.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(CounterIconWidget);
