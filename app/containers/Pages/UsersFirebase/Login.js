import React from 'react';
import { Helmet } from 'react-helmet';
import {
  getAuth, signInWithEmailAndPassword,
} from 'firebase/auth';
import { FormattedMessage } from 'react-intl';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { SelectLanguage, LoginForm } from 'enl-components';
import logo from 'enl-images/logo.svg';
import brand from 'enl-api/dummy/brand';
import useStyles from 'enl-components/Forms/user-jss';
import {
  requestAuth, loginUser,
  setMessage, hideMessage
} from 'enl-redux/modules/auth';
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
  const description = brand.desc;

  const loginEmail = (values) => {
    const { email, password } = values;
    dispatch(requestAuth());

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const { user } = userCredential;
        if (user) {
          dispatch(loginUser(user));
          if (getUrlVars().next) {
            // Redirect to next route
            navigate(getUrlVars().next);
          } else {
            // Redirect to dashboard if no next parameter
            navigate('/app');
          }
        }
      })
      .catch((error) => {
        dispatch(setMessage(error.message));
      });
  };

  return (
    <div className={classes.rootFull}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
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
            <div className={classes.openingFooter}>
              <NavLink to="/" className={classes.back}>
                <ArrowBack />
                &nbsp;back to site
              </NavLink>
              <div className={classes.lang}>
                <SelectLanguage />
              </div>
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
