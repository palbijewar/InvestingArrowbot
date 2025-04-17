import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Button,
  useMediaQuery,
  FormControl,
  Paper,
  Typography,
  CircularProgress,
  TextField,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { injectIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as yup from 'yup';

import brand from 'enl-api/dummy/brand';
import logo from 'enl-images/logo.svg';
import MessagesForm from './MessagesForm';
import messages from './messages';
import useStyles from './user-jss';
import { updateUserProfile } from '../../middlewares/interceptors';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup
    .string()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid Indian phone number')
    .required('Phone number is required'),
});

const EditProfileForm = ({ intl }) => {
  const { classes, cx } = useStyles();
  const navigate = useNavigate();
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const userInfo = localStorage.getItem('sponsor_details');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        setInitialValues({
          name: parsed?.username || '',
          email: parsed?.email || '',
          phone: parsed?.phone || '',
        });
      } catch (e) {
        console.warn('Invalid sponsor_details in localStorage', e);
      }
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setServerMessage(null);
      try {
        const response = await updateUserProfile({
          username: values.name,
          email: values.email,
          phone: values.phone,
        });

        if (response?.updatedUser?.status === 'success') {
          setServerMessage({ type: 'success', text: 'Profile updated successfully!' });
          setTimeout(() => navigate('/app'), 2000);
        } else {
          throw new Error(response?.message || 'Profile update failed.');
        }
      } catch (error) {
        setServerMessage({
          type: 'error',
          text: error.response?.updatedUser?.data?.message || error.message || 'Something went wrong.',
        });
      } finally {
        setLoading(false);
      }
    },
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
          Edit Profile
        </Typography>
      </div>

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

          <div className={classes.btnArea}>
            <Button variant="contained" fullWidth disabled={loading} color="primary" type="submit">
              {loading ? (
                <CircularProgress size={24} className={classes.buttonProgress} />
              ) : (
                <>
                  Update Profile
                  <ArrowForward className={cx(classes.rightIcon, classes.iconSmall, classes.signArrow)} />
                </>
              )}
            </Button>
          </div>
        </form>
      </section>
    </Paper>
  );
};

EditProfileForm.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(EditProfileForm);
