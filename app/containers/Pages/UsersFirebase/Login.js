import React from 'react';
import { Helmet } from 'react-helmet';
import {
  getAuth,
} from 'firebase/auth';
import { FormattedMessage } from 'react-intl';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { LoginForm } from 'enl-components';
import logo from 'enl-images/logo.svg';
import brand from 'enl-api/dummy/brand';
import useStyles from 'enl-components/Forms/user-jss';
import { hideMessage } from 'enl-redux/modules/auth';
import messages from './messages';

function getUrlVars() {
  const vars = {};
  const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) { // eslint-disable-line
    vars[key] = value;
  });
  return vars;
}

function Login() {
  const auth = getAuth();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messageAuth = useSelector((state) => state.auth.message);
  const loading = useSelector((state) => state.auth.loading);

  const { classes } = useStyles();
  const mdDown = useMediaQuery(theme => theme.breakpoints.down('md'));

  const title = brand.name + ' - Login';

  const loginEmail = () => {
    navigate('/app');
  };

  return (
    <div className={classes.rootFull}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className={classes.containerSide}>
        {!mdDown && (
          <div className={classes.opening}>
            <div className={classes.openingWrap}>
              <div className={classes.openingHead}>
                <NavLink to="/" className={classes.brand}>
                  <img src={logo} alt={brand.name} />
                  {brand.name}
                </NavLink>
              </div>
              <Typography variant="h3" component="h1" gutterBottom>
                <FormattedMessage {...messages.welcomeTitle} />
                &nbsp;
                {brand.name}
              </Typography>
              <Typography variant="h6" component="p" className={classes.subpening}>
                <FormattedMessage {...messages.welcomeSubtitle} />
              </Typography>
            </div>
          </div>
        )}
        <div className={classes.sideFormWrap}>
          <LoginForm
            submitForm={(values) => loginEmail(values)}
            loading={loading}
            messagesAuth={messageAuth}
            closeMsg={() => dispatch(hideMessage())}
            link="/register-firebase"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
