import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Info from '@mui/icons-material/Info';
import Warning from '@mui/icons-material/Warning';
import Check from '@mui/icons-material/CheckCircle';
import Error from '@mui/icons-material/RemoveCircle';
import ExitToApp from '@mui/icons-material/ExitToApp';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import dummy from 'enl-api/dummy/dummyContents';
import { injectIntl, FormattedMessage } from 'react-intl';
import messageStyles from 'enl-styles/Messages.scss';
import avatarApi from 'enl-api/images/avatars';
import link from 'enl-api/ui/link';
import NotificationsActiveOutlined from '@mui/icons-material/NotificationsActiveOutlined';
import messages from './messages';
import useStyles from './header-jss';

function UserMenu(props) {
  const { classes, cx } = useStyles();
  const {
    signOut,
    avatar
  } = props;

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const handleMenu = menu => (event) => {
    setOpenMenu(openMenu === menu ? null : menu);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

  return (
    <div>
      <Button onClick={handleMenu('user-setting')}>
        <Avatar
          alt="avatar"
          src={avatar}
        />
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
  avatar: PropTypes.string.isRequired,
  dark: PropTypes.bool,
};

UserMenu.defaultProps = {
  dark: false
};

export default injectIntl(UserMenu);
