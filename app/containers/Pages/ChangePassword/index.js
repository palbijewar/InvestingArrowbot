import React, { useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import LockIcon from '@mui/icons-material/Lock';
import { Button, TextField, Paper } from '@mui/material';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: theme.spacing(2),
    background: theme.palette.background.default
  },
  paper: {
    padding: theme.spacing(4),
    width: '100%',
    maxWidth: 500,
    textAlign: 'center',
    boxShadow: theme.shadows[3],
  },
  avatar: {
    margin: '0 auto',
    backgroundColor: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    width: 64,
    height: 64,
    '& svg': {
      fontSize: 32,
    },
  },
  form: {
    marginTop: theme.spacing(2),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
}));

function ChangePassword() {
  const title = brand.name + ' - Change Password';
  const description = brand.desc;
  const { classes } = useStyles();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
    } else {
      setErrors({});
      console.log('Password change submitted:', formData);
      alert('Password updated successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography variant="h5" gutterBottom>
            Change Password
          </Typography>
          <form noValidate onSubmit={handleSubmit} className={classes.form}>
            <TextField
              name="currentPassword"
              label="Current Password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formData.currentPassword}
              onChange={handleChange}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
            />
            <TextField
              name="newPassword"
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formData.newPassword}
              onChange={handleChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
            />
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className={classes.submit}
            >
              Update Password
            </Button>
          </form>
        </Paper>
      </div>
    </>
  );
}

export default ChangePassword;
