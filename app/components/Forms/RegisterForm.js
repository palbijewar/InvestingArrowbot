import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { injectIntl, FormattedMessage } from 'react-intl';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

import brand from 'enl-api/dummy/brand';
import logo from 'enl-images/logo.svg';
import MessagesForm from './MessagesForm';
import messages from './messages';
import useStyles from './user-jss';
import { signUpUser, loginService } from '../../middlewares/interceptors.js';

const validationSchema = yup.object({
  name: yup.string('Enter your name').required('Name is required'),
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  password: yup.string('Enter your password').required('Password is required'),
  passwordConfirmation: yup.string()
    .required('Re-type Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

// eslint-disable-next-line react/display-name, react/prop-types
const LinkBtn = React.forwardRef((props) => <NavLink to={props.to} {...props} />);

function RegisterForm(props) {
  const { classes, cx } = useStyles();
  const navigate = useNavigate();
  const mdUp = useMediaQuery(theme => theme.breakpoints.up('md'));
  const [generatedSponsorId, setGeneratedSponsorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState(null);

  const {
    link, intl, messagesAuth, closeMsg
  } = props;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      sponsorId: '',
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      termsAndConditions: false
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setServerMessage(null);
      try {
        const response = await signUpUser({
          sponsor_id: values.sponsorId,
          username: values.name,
          email: values.email,
          password: values.password,
          confirm_password: values.passwordConfirmation,
        });

        if (response?.status === 'success') {
          await loginService({
            sponsor_id: values.sponsorId,
            password: values.password,
          });

          setTimeout(() => navigate('/app'), 2000);
        } else {
          throw new Error(response?.message || 'Signup failed. Please try again.');
        }
      } catch (error) {
        setServerMessage({
          type: 'error',
          text: error.response?.data?.message || error.message || 'Registration failed. Try again.',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const sponsorId = uuidv4().slice(0, 8);
    setGeneratedSponsorId(sponsorId);
    formik.setFieldValue('sponsorId', sponsorId);
  }, []);

  return (
    <Paper className={classes.sideWrap}>
      {!mdUp && (
        <div className={classes.headLogo}>
          <NavLink to="/" className={classes.brand}>
            <img src={logo} alt={brand.name} />
            {brand.name}
          </NavLink>
        </div>
      )}
      <div className={classes.topBar}>
        <Typography variant="h4" className={classes.title}>
          <FormattedMessage {...messages.register} />
        </Typography>
        <Button size="small" className={classes.buttonLink} component={LinkBtn} to={link}>
          <FormattedMessage {...messages.toAccount} />
        </Button>
      </div>

      {messagesAuth && (
        <MessagesForm
          variant="error"
          className={classes.msgUser}
          message={messagesAuth}
          onClose={closeMsg}
        />
      )}

      {serverMessage && (
        <MessagesForm
          variant={serverMessage.type}
          className={classes.msgUser}
          message={serverMessage.text}
          onClose={() => setServerMessage(null)}
        />
      )}

      <section>
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth className={classes.formControl}>
            <TextField
              id="sponsorId"
              name="sponsorId"
              label="Sponsor ID"
              variant="outlined"
              value={formik.values.sponsorId}
              disabled
            />
          </FormControl>

          <FormControl fullWidth className={classes.formControl}>
            <TextField
              id="name"
              name="name"
              label={intl.formatMessage(messages.loginFieldName)}
              variant="standard"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </FormControl>

          <FormControl fullWidth className={classes.formControl}>
            <TextField
              id="email"
              name="email"
              label={intl.formatMessage(messages.loginFieldEmail)}
              variant="standard"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </FormControl>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth className={classes.formControl}>
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  label={intl.formatMessage(messages.loginFieldPassword)}
                  variant="standard"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth className={classes.formControl}>
                <TextField
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type="password"
                  label={intl.formatMessage(messages.loginFieldRetypePassword)}
                  variant="standard"
                  value={formik.values.passwordConfirmation}
                  onChange={formik.handleChange}
                  error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
                  helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                />
              </FormControl>
            </Grid>
          </Grid>

          <div className={classes.btnArea}>
            <Button variant="contained" fullWidth disabled={loading} color="primary" type="submit">
              {loading ? <CircularProgress size={24} className={classes.buttonProgress} /> : 'Sign Up'}
              {!loading && <ArrowForward className={cx(classes.rightIcon, classes.iconSmall, classes.signArrow)} />}
            </Button>
          </div>
        </form>
      </section>
    </Paper>
  );
}

RegisterForm.propTypes = {
  intl: PropTypes.object.isRequired,
  messagesAuth: PropTypes.string,
  closeMsg: PropTypes.func,
  link: PropTypes.string,
};

RegisterForm.defaultProps = {
  messagesAuth: null,
  link: '#',
};

export default injectIntl(RegisterForm);
