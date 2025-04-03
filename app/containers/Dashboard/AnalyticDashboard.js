import React from 'react';
import brand from 'enl-api/dummy/brand';
import { Helmet } from 'react-helmet';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import {
  CounterIconsWidget,
  PerformanceChartWidget,
  TaskWidget,
  FilesWidget,
} from 'enl-components';
import useStyles from './dashboard-jss';

function AnalyticDashboard() {
  const title = brand.name + ' - Personal Dashboard';
  const description = brand.desc;

  const { classes } = useStyles();

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>

      {/* 1st Section */}
      <Grid container spacing={3} className={classes.root}>
        <Grid item xs={12}>
          <CounterIconsWidget />
        </Grid>
      </Grid>
      <Divider className={classes.divider} />

      {/* Performance & Task Widget Side by Side */}
      <Grid container spacing={3} className={classes.root}>
        <Grid item md={6} xs={12}>
          <PerformanceChartWidget />
        </Grid>
        <Grid item md={6} xs={12}>
          <TaskWidget />
        </Grid>
      </Grid>

      <Divider className={classes.divider} />
      <FilesWidget />
    </div>
  );
}

export default AnalyticDashboard;
