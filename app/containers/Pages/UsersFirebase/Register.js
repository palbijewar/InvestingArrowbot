import React from 'react';
import { Helmet } from 'react-helmet';
import {
  getAuth, updateProfile, createUserWithEmailAndPassword,
} from 'firebase/auth';
import { FormattedMessage } from 'react-intl';
import Typography from '@mui/material/Typography';
import { NavLink, useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterForm } from 'enl-components';
import useStyles from 'enl-components/Forms/user-jss';
import brand from 'enl-api/dummy/brand';
import logo from 'enl-images/logo.svg';
import {
  requestAuth, loginUser,
  setMessage, hideMessage
} from 'enl-redux/modules/auth';
import messages from './messages';

function Register() {
  const auth = getAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messageAuth = useSelector((state) => state.auth.message);
  const loading = useSelector((state) => state.auth.loading);

  const { classes } = useStyles();
  const mdDown = useMediaQuery(theme => theme.breakpoints.down('md'));

  const title = brand.name + ' - Register';
  const description = brand.desc;

  const registerEmail = (values) => {
    const { name, email, password } = values;
    dispatch(requestAuth());

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        updateProfile(auth.currentUser, {
          displayName: name
        }).then(() => {
          const { user } = userCredential;
          if (user) {
            dispatch(loginUser(user));
            navigate('/app');
          }
        }).catch((error) => {
          dispatch(setMessage(error.message));
        });
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
              <Typography variant="h3" component="h1" className={classes.opening} gutterBottom>
                <FormattedMessage {...messages.greetingTitle} />
              </Typography>
              <Typography variant="h6" component="p" className={classes.subpening}>
                <FormattedMessage {...messages.greetingSubtitle} />
              </Typography>
            </div>
          </div>
        )}
        <div className={classes.sideFormWrap}>
          <RegisterForm
            submitForm={(values) => registerEmail(values)}
            loading={loading}
            messagesAuth={messageAuth}
            closeMsg={() => dispatch(hideMessage())}
            link="/login-firebase"
          />
        </div>
      </div>
    </div>
  );
}

export default Register;
