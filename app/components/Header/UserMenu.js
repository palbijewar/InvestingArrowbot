import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ExitToApp from '@mui/icons-material/ExitToApp';
import { injectIntl, FormattedMessage } from 'react-intl';
import dummy from 'enl-api/dummy/dummyContents';
import link from 'enl-api/ui/link';
import messages from './messages';
import useStyles from './header-jss';

function UserMenu(props) {
  const { classes, cx } = useStyles();
  const { signOut } = props;

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [avatar, setAvatar] = useState(dummy.user.avatar);

  const handleMenu = menu => (event) => {
    setOpenMenu(openMenu === menu ? null : menu);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed.photoURL) {
          setAvatar(parsed.photoURL);
        }
      } catch (e) {
        console.warn('Invalid user_info in localStorage', e);
      }
    }
  }, []);

  return (
    <div>
      <Button onClick={handleMenu('user-setting')}>
        <Avatar alt="avatar" src={avatar} />
      </Button>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={openMenu === 'user-setting'}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} component={Link} to={link.profile}>
          <FormattedMessage {...messages.profile} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => signOut(navigate)}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <FormattedMessage {...messages.logout} />
        </MenuItem>
      </Menu>
    </div>
  );
}

UserMenu.propTypes = {
  signOut: PropTypes.func.isRequired,
};

export default injectIntl(UserMenu);
