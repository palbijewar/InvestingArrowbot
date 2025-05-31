import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';

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
  getBotIncome,
  getExpiryDays,
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
  const [botLevelIncome, setBotLevelIncome] = useState(0);
  const [currentRank, setCurrentRank] = useState(0);
  const [rankIncome, setRankIncome] = useState(0);
  const [directPortfolioIncome, setDirectPortfolioIncome] = useState(0);
  const [downlinePortfolioIncome, setDownlinePortfolioIncome] = useState(0);
  const [gasWalletFund, setGasWalletFund] = useState(0);
  const [expiryDays, setExpiryDays] = useState(0);

  useEffect(() => {
    const sponsorDetails = JSON.parse(localStorage.getItem('sponsor_details'));
    const sponsorId = sponsorDetails?.sponsor_id;
  
    const fetchPrimaryData = async () => {
      try {
        const [
          directTeamCountRes,
          downlineTeamCountRes,
          directPortfolioInvestmentRes,
          downlinePortfolioInvestmentRes,
          getExpiryDaysResponse,
        ] = await Promise.all([
          getDirectTeamCount(sponsorId),
          getTotalDownlineTeamCount(sponsorId),
          getDirectPortfolioInvestment(sponsorId),
          getDownlinePortfolioInvestment(sponsorId),
          getExpiryDays(sponsorId)
        ]);
  console.log({getExpiryDaysResponse});
  
        setExpiryDays(getExpiryDaysResponse?.data?.remaining_days || 0);
        setDirectTeamCount(directTeamCountRes?.data?.count || 0);
        setDownlineTeamCount(downlineTeamCountRes?.data?.count || 0);
        setDirectPortfolioInvestment(directPortfolioInvestmentRes?.data?.direct_portfolio_investment || 0);
        setDownlinePortfolioInvestment(downlinePortfolioInvestmentRes?.data?.downline_portfolio_investment || 0);
      } catch (error) {
        console.error('Error fetching primary dashboard data:', error);
      }
    };
  
    const fetchSecondaryData = async () => {
      try {
        const [
          botDirectPortfolioInvestmentRes,
          botDownlinePortfolioInvestmentRes,
          botDirectBotActivationRes,
          botDownlineBotActivationRes,
          levelIncomeRes,
          rankInfoRes,
          profitSummaryRes,
          gasWalletRes,
          botIncomeRes,
        ] = await Promise.all([
          getBotDirectPortfolioInvestment(sponsorId),
          getBotDownlinePortfolioInvestment(sponsorId),
          getBotDirectActivationCount(sponsorId),
          getBotDownlineActivationCount(sponsorId),
          getSecondLevelReferralsTotalIncome(sponsorId),
          getRankInformations(sponsorId),
          getSponsorProfitDetails(sponsorId),
          getGasWalletTortalFundBySponsorId(sponsorId),
          getBotIncome(sponsorId),
        ]);
  
        setDirectBotBusiness(botDirectPortfolioInvestmentRes?.data?.direct_bot_income || 0);
        setDownlineBotBusiness(botDownlinePortfolioInvestmentRes?.data?.downline_bot_income || 0);
        setDirectBotAtivation(botDirectBotActivationRes?.data?.direct_bot_count || 0);
        setBotAtivation(botDownlineBotActivationRes?.data?.downline_bot_count || 0);
        setLevelIncome(profitSummaryRes?.totalIncome || 0);
        setCurrentRank(rankInfoRes?.data?.rank || 0);
        setRankIncome(rankInfoRes?.data?.income || 0);
        setDirectPortfolioIncome(profitSummaryRes?.totalDirectIncome || 0);
        setDownlinePortfolioIncome(profitSummaryRes?.totalDownlineIncome || 0);
        setGasWalletFund(gasWalletRes?.data?.totalGasWalletFund || 0);
        setBotLevelIncome(botIncomeRes?.data?.totalIncome || 0);
      } catch (error) {
        console.error('Error fetching secondary dashboard data:', error);
      }
    };
  
    fetchPrimaryData().then(fetchSecondaryData);
  }, []);
  
  return (
    <div className={classes.rootCounterFull}>
      <Grid container spacing={2}>
      <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-dark" start={0} end={expiryDays} duration={3} title="Expiry Days">
            <PrecisionManufacturing className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-dark" start={0} end={directBotAtivation} duration={3} title="Direct Bot Activation">
            <SmartToy className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-dark" start={0} end={directBotBusiness} duration={3} title="Direct Bot Business">
            <PrecisionManufacturing className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={downlineBotAtivation} duration={3} title="Downline Bot Activation">
            <GroupAdd className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={downlineBotBusiness} duration={3} title="Downline Bot Business">
            <Groups3 className={classes.counterIcon} />
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
            <LocalAtm className={classes.counterIcon} />
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
            <AccountBalance className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-dark" start={0} end={directPortfolioIncome} duration={3} title="Direct Portfolio Income">
            <LocalAtm className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-dark" start={0} end={downlinePortfolioIncome} duration={3} title="Downline Portfolio Income">
            <AccountBalance className={classes.counterIcon} />
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
            <Diversity1 className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={downlineTeamCount} duration={3} title="Downline Team">
            <SupervisorAccount className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={currentRank} duration={3} title="Current Rank">
            <MilitaryTech className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget color="secondary-main" start={0} end={gasWalletFund} duration={3} title="Gas Wallet Fund">
            <MilitaryTech className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
        <CounterWidget
  color="secondary-main"
  start={0}
  end={parseFloat(botLevelIncome.toFixed(4))}
  duration={3}
  title="Bot Level Income"
>
  <MilitaryTech className={classes.counterIcon} />
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
