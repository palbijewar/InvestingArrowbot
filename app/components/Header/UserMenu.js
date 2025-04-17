import React, { useState } from 'react';
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
import link from 'enl-api/ui/link';
import messages from './messages';
import useStyles from './header-jss';

function UserMenu(props) {
  const { classes } = useStyles();
  const { signOut, avatar } = props;

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
        <Avatar className={classes.avatar}>
          {avatar || 'U'}
        </Avatar>
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
  avatar: PropTypes.string
};

UserMenu.defaultProps = {
  avatar: ''
};

export default injectIntl(UserMenu);
