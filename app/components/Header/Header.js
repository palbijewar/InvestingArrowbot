import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InvertColors from '@mui/icons-material/InvertColorsOutlined';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import { NavLink, Link } from 'react-router-dom';
import brand from 'enl-api/dummy/brand';
import logo from 'enl-images/logo.svg';
import { injectIntl, FormattedMessage } from 'react-intl';
import link from 'enl-api/ui/link';
import UserMenu from './UserMenu';
import messages from './messages';
import useStyles from './header-jss';

function Header(props) {
  const { classes, cx } = useStyles();
  const lgDown = useMediaQuery(theme => theme.breakpoints.down('lg'));
  const mdDown = useMediaQuery(theme => theme.breakpoints.down('md'));
  const smDown = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const {
    changeMode,
    toggleDrawerOpen,
    margin,
    mode,
    signOut,
    dense,
    intl
  } = props;
  const [open] = useState(false);
  const [turnDarker, setTurnDarker] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userInitial, setUserInitial] = useState('');

  const isAuthenticated = localStorage.getItem('access_token');
  // Initial header style
  let flagDarker = false;
  let flagTitle = false;

  useEffect(() => {
    if (isAuthenticated) {
      const userInfo = localStorage.getItem('sponsor_details');
      if (userInfo) {
        try {
          const parsed = JSON.parse(userInfo);
          if (parsed.username) {
            setUserId(parsed.sponsor_id);
            setUserInitial(parsed.username.charAt(0).toUpperCase());
          }
        } catch (e) {
          console.warn('Invalid user_info in localStorage', e);
        }
      }
    }
  }, [isAuthenticated]);

  const handleScroll = () => {
    const doc = document.documentElement;
    const scroll = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    const newFlagDarker = (scroll > 30);
    const newFlagTitle = (scroll > 40);
    if (flagDarker !== newFlagDarker) {
      setTurnDarker(newFlagDarker);
      flagDarker = newFlagDarker;
    }
    if (flagTitle !== newFlagTitle) {
      setShowTitle(newFlagTitle);
      flagTitle = newFlagTitle;
    }
  };

  const turnMode = newMode => {
    if (newMode === 'light') {
      changeMode('dark');
    } else {
      changeMode('light');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AppBar
      className={cx(
        classes.appBar,
        classes.floatingBar,
        margin && classes.appBarShift,
        turnDarker && classes.darker,
      )}
    >
      <Toolbar disableGutters={!open}>
        <div className={cx(classes.brandWrap, dense && classes.dense)}>
          <span>
            <IconButton
              className={classes.menuButton}
              aria-label="Menu"
              onClick={toggleDrawerOpen}
              size="large">
              <MenuIcon />
            </IconButton>
          </span>
          {!mdDown && (
            <NavLink to="/app" className={cx(classes.brand, classes.brandBar)}>
              <img src={logo} alt={brand.name} />
              {brand.name}
            </NavLink>
          )}
        </div>
        {!lgDown && (
          <div className={classes.headerProperties}>
            <div
              className={cx(
                classes.headerAction,
                showTitle && classes.fadeOut,
              )}
            >
              <Tooltip title={intl.formatMessage(messages.lamp)} placement="bottom">
                <IconButton className={classes.button} onClick={() => turnMode(mode)} size="large">
                  <InvertColors />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        )}
        {!smDown && (
          <span className={classes.separatorV} />
        )}
        <div className={classes.userToolbar}>
          {isAuthenticated ? (
            <>
              <Typography variant="body1" style={{ marginRight: 10, color: mode === 'light' ? '#000' : '#fff' }}>
                Sponsor ID: {userId || 'Loading...'}
              </Typography>
              <UserMenu signOut={signOut} avatar={userInitial} />
            </>
          ) : (
            <Button
              color="primary"
              className={classes.buttonTop}
              component={Link}
              to={link.login}
              variant="contained"
            >
              <AccountCircle />
              <FormattedMessage {...messages.login} />
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  toggleDrawerOpen: PropTypes.func.isRequired,
  avatar: PropTypes.string.isRequired,
  margin: PropTypes.bool.isRequired,
  isLogin: PropTypes.bool,
  dense: PropTypes.bool,
  mode: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  changeMode: PropTypes.func.isRequired,
  openGuide: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired
};

Header.defaultProps = {
  dense: false,
  isLogin: false
};

export default injectIntl(Header);
