import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Button,
  useMediaQuery,
  FormControl,
  Paper,
  Grid,
  Typography,
  CircularProgress,
  TextField
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { injectIntl, FormattedMessage } from 'react-intl';
import { useFormik } from 'formik';
import * as yup from 'yup';
import emailjs from '@emailjs/browser';
import brand from 'enl-api/dummy/brand';
import logo from 'enl-images/logo.svg';
import MessagesForm from './MessagesForm';
import messages from './messages';
import useStyles from './user-jss';
import { signUpUser, getSponsorName } from '../../middlewares/interceptors.js';
import { useLocation } from 'react-router-dom';

const validationSchema = yup.object({
  name: yup.string('Enter your name').required('Name is required'),
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  phone: yup
    .string()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid Indian phone number')
    .required('Phone number is required'),
  password: yup.string('Enter your password').required('Password is required'),
  passwordConfirmation: yup
    .string()
    .required('Re-type Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

// eslint-disable-next-line react/display-name, react/prop-types
const LinkBtn = React.forwardRef((props) => <NavLink to={props.to} {...props} />);

function RegisterForm({
  intl, messagesAuth, closeMsg, link
}) {
  const { classes, cx } = useStyles();
  const navigate = useNavigate();
  const mdUp = useMediaQuery(theme => theme.breakpoints.up('md'));
  const [generatedSponsorId, setGeneratedSponsorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState(null);
  const [referralSponsorName, setReferralSponsorName] = useState('');
  const location = useLocation();

useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const referralId = queryParams.get('ref');

  if (referralId) {
    formik.setFieldValue('referralSponsorId', referralId);
  }
}, [location.search]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      sponsorId: '',
      referralSponsorId: '',
      name: '',
      email: '',
      phone: '',
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
          referralSponsorId: values.referralSponsorId,
          sponsor_id: values.sponsorId,
          username: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password,
          confirm_password: values.passwordConfirmation,
        });

        if (response?.status === 'success') {
          // Send Email via EmailJS
          const templateParams = {
            name: values.name,
            email: values.email,
            phone: values.phone,
            sponsorId: values.sponsorId,
            to_email: values.email,
          };

          emailjs
            .send(
              'service_7o89yef',
              'template_j9a6vpa',
              templateParams,
              'kdqrjbiQBw5xyS8wN'
            )
            .then(
              (result) => {
                console.log('Email successfully sent!', result.text);
              },
              (error) => {
                console.error('EmailJS error:', error.text);
              }
            );

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
    }
  });

  useEffect(() => {
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    const sponsorId = `INA${randomNum}`;
    setGeneratedSponsorId(sponsorId);
    formik.setFieldValue('sponsorId', sponsorId);
  }, []);

  useEffect(() => {
    const fetchSponsorName = async () => {
      const id = formik.values.referralSponsorId.trim();
      if (!id) return;
      try {
        const response = await getSponsorName(id);
        setReferralSponsorName(response?.data?.username || 'Sponsor not found');
      } catch {
        setReferralSponsorName('Sponsor not found');
      }
    };

    fetchSponsorName();
  }, [formik.values.referralSponsorId]);

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
        <MessagesForm variant="error" className={classes.msgUser} message={messagesAuth} onClose={closeMsg} />
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
              id="referralSponsorId"
              name="referralSponsorId"
              label="Referral Sponsor ID"
              variant="outlined"
              value={formik.values.referralSponsorId}
              onChange={formik.handleChange}
            />
          </FormControl>

          <FormControl fullWidth className={classes.formControl}>
            <TextField
              id="referralSponsorName"
              name="referralSponsorName"
              label="Sponsor Name"
              variant="outlined"
              value={referralSponsorName}
              disabled
            />
          </FormControl>

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
              variant="outlined"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </FormControl>

          <FormControl fullWidth className={classes.formControl}>
            <TextField
              id="phone"
              name="phone"
              label="Phone Number"
              variant="outlined"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
          </FormControl>

          <FormControl fullWidth className={classes.formControl}>
            <TextField
              id="email"
              name="email"
              label={intl.formatMessage(messages.loginFieldEmail)}
              variant="outlined"
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
                  variant="outlined"
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
                  variant="outlined"
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
              {loading ? (
                <CircularProgress size={24} className={classes.buttonProgress} />
              ) : (
                <>
                  Sign Up
                  <ArrowForward className={cx(classes.rightIcon, classes.iconSmall, classes.signArrow)} />
                </>
              )}
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
