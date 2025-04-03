import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
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
import brand from 'enl-api/dummy/brand';
import logo from 'enl-images/logo.svg';
import { v4 as uuidv4 } from 'uuid';
import MessagesForm from './MessagesForm';
import messages from './messages';
import useStyles from './user-jss';

// validation functions
const validationSchema = yup.object({
  name: yup
    .string('Enter your name')
    .required('Name is required'),
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .required('Password is required'),
  passwordConfirmation: yup
    .string()
    .required('Re-type Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  termsAndConditions: yup
    .bool()
    .oneOf([true])
});

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) { // eslint-disable-line
  return <NavLink to={props.to} {...props} />; // eslint-disable-line
});

function RegisterForm(props) {
  const { classes, cx } = useStyles();
  const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });
  const mdUp = useMediaQuery(theme => theme.breakpoints.up('md'));
  const [generatedSponsorId, setGeneratedSponsorId] = useState('');

  const {
    link, intl, messagesAuth,
    closeMsg, loading, submitForm,
  } = props;

  const formik = useFormik({
    initialValues: {
      sponsorId: generatedSponsorId,
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      termsAndConditions: false
    },
    validationSchema,
    onSubmit: async (values) => {
      await sleep(500);
      submitForm(values);
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
      {
        messagesAuth !== null || ''
          ? (
            <MessagesForm
              variant="error"
              className={classes.msgUser}
              message={messagesAuth}
              onClose={closeMsg}
            />
          )
          : ''
      }
      <section>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <FormControl variant="standard" className={classes.formControl}>
              <TextField
                fullWidth
                id="sponsorId"
                name="sponsorId"
                label="Sponsor ID"
                variant="outlined"
                value={formik.values.sponsorId}
                onChange={formik.handleChange}
                error={formik.touched.sponsorId && Boolean(formik.errors.sponsorId)}
                helperText={formik.touched.sponsorId && formik.errors.sponsorId}
                disabled
              />
            </FormControl>
          </div>
          <div>
            <FormControl variant="standard" className={classes.formControl}>
              <TextField
                id="name"
                name="name"
                label={intl.formatMessage(messages.loginFieldName)}
                variant="standard"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                className={classes.field}
              />
            </FormControl>
          </div>
          <div>
            <FormControl variant="standard" className={classes.formControl}>
              <TextField
                id="email"
                name="email"
                label={intl.formatMessage(messages.loginFieldEmail)}
                variant="standard"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                className={classes.field}
              />
            </FormControl>
          </div>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl variant="standard" className={classes.formControl}>
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
                  className={classes.field}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl variant="standard" className={classes.formControl}>
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
                  className={classes.field}
                />
              </FormControl>
            </Grid>
          </Grid>
          <div className={classes.btnArea}>
            <Button variant="contained" fullWidth disabled={loading} color="primary" type="submit">
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              <FormattedMessage {...messages.loginButtonContinue} />
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
  loading: PropTypes.bool,
  submitForm: PropTypes.func.isRequired,
  link: PropTypes.string,
};

RegisterForm.defaultProps = {
  messagesAuth: null,
  loading: false,
  link: '#'
};

export default injectIntl(RegisterForm);
