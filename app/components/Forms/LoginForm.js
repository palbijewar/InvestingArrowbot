import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import { injectIntl, FormattedMessage } from 'react-intl';
import { useFormik } from 'formik';
import * as yup from 'yup';

import brand from 'enl-api/dummy/brand';
import logo from 'enl-images/logo.svg';
import { loginService } from '../../middlewares/interceptors.js';
import MessagesForm from './MessagesForm';
import messages from './messages';
import useStyles from './user-jss';

const validationSchema = yup.object({
  sponsor_id: yup
    .string('Enter your Sponsor ID')
    .required('Sponsor ID is required'),
  password: yup
    .string('Enter your password')
    .required('Password is required'),
});

// eslint-disable-next-line react/display-name, react/prop-types
const LinkBtn = React.forwardRef((props) => <NavLink to={props.to} {...props} />);
function LoginForm(props) {
  const { classes, cx } = useStyles();
  const mdUp = useMediaQuery(theme => theme.breakpoints.up('md'));
  const {
    link, intl, messagesAuth, closeMsg,
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState(null);

  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      sponsor_id: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setServerMessage(null);

      try {
        const response = await loginService({
          sponsor_id: values.sponsor_id,
          password: values.password,
        });
        const accessToken = response.data?.data?.access_token || response?.data?.access_token;
        if (!accessToken) throw new Error('Token missing in response');
        navigate('/app');
      } catch (error) {
        console.error('Login error:', error);
        setServerMessage({
          type: 'error',
          text: error.response?.data?.message || 'Invalid credentials',
        });
      } finally {
        setLoading(false);
      }
    }
  });

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
          <FormattedMessage {...messages.login} />
        </Typography>
        <Button size="small" className={classes.buttonLink} component={LinkBtn} to={link}>
          <FormattedMessage {...messages.createNewAccount} />
        </Button>
      </div>

      {(messagesAuth || serverMessage) && (
        <MessagesForm
          variant="error"
          className={classes.msgUser}
          message={messagesAuth || serverMessage?.text}
          onClose={closeMsg}
        />
      )}

      <section className={classes.pageFormSideWrap}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl variant="standard" className={classes.formControl}>
            <TextField
              id="sponsor_id"
              name="sponsor_id"
              label="Sponsor ID"
              variant="standard"
              value={formik.values.sponsor_id}
              onChange={formik.handleChange}
              error={formik.touched.sponsor_id && Boolean(formik.errors.sponsor_id)}
              helperText={formik.touched.sponsor_id && formik.errors.sponsor_id}
              className={classes.field}
            />
          </FormControl>
          <FormControl variant="standard" className={classes.formControl}>
            <TextField
              id="password"
              name="password"
              label={intl.formatMessage(messages.loginFieldPassword)}
              type={showPassword ? 'text' : 'password'}
              variant="standard"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              className={classes.field}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      size="large"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          <div className={classes.optArea}>
            <FormControlLabel
              className={classes.label}
              control={<Checkbox name="checkbox" />}
              label={intl.formatMessage(messages.loginRemember)}
            />
            <Button size="small" component={LinkBtn} to="/reset-password" className={classes.buttonLink}>
              <FormattedMessage {...messages.loginForgotPassword} />
            </Button>
          </div>

          <div className={classes.btnArea}>
            <Button
              variant="contained"
              disabled={loading}
              fullWidth
              color="primary"
              size="large"
              type="submit"
            >
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

LoginForm.propTypes = {
  intl: PropTypes.object.isRequired,
  messagesAuth: PropTypes.string,
  closeMsg: PropTypes.func,
  link: PropTypes.string,
};

LoginForm.defaultProps = {
  messagesAuth: null,
  closeMsg: () => {},
  link: '#',
};

export default injectIntl(LoginForm);
