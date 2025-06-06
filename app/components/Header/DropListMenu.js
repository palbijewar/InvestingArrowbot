import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { useLocation, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Paper from '@mui/material/Paper';
import { injectIntl, FormattedMessage } from 'react-intl';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import messages from 'enl-api/ui/menuMessages';
import useStyles from './header-jss';

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) { // eslint-disable-line
  return <NavLink to={props.to} {...props} />; // eslint-disable-line
});

function MainMenu(props) { // eslint-disable-line
  const { classes, cx } = useStyles();
  const { dataMenu, intl } = props;

  const location = useLocation();
  const open = useSelector((state) => state.ui.subMenuOpen);

  const [active, setActive] = useState([]);
  const [openMenu, setOpenMenu] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [initActive, setInitActive] = useState(true);

  const handleOpenMenu = (event, key) => {
    setAnchorEl(event.currentTarget);
    setTimeout(() => {
      setOpenMenu([key]);
    }, 50);
  };

  const handleClose = event => {
    if (anchorEl.contains(event.target)) {
      return;
    }
    setOpenMenu([]);
  };

  const handleActiveParent = key => {
    setTimeout(() => {
      setInitActive(false);
      setActive([key]);
    }, 500);
    setOpenMenu([]);
  };

  const getMenus = (parent, menuArray) => menuArray.map((item, index) => {
    if (item.multilevel) {
      return false;
    }
    if (item.child || item.linkParent) {
      return (
        <div key={index.toString()}>
          <Button
            aria-owns={open ? 'menu-list-grow' : undefined}
            component={item.linkParent ? LinkBtn : 'button'}
            to={item.linkParent ? item.linkParent : '#'}
            className={
              cx(
                classes.headMenu,
                openMenu.indexOf(item.key) > -1 ? classes.opened : '',
                active.indexOf(item.key) > -1 ? classes.selected : '',
                initActive && open.indexOf(item.key) > -1 ? classes.selected : ''
              )
            }
            onClick={(event) => handleOpenMenu(event, item.key)}
          >
            {
              messages[item.key] !== undefined
                ? <FormattedMessage {...messages[item.key]} />
                : item.name
            }
            { !item.linkParent ? <ExpandMore className={classes.rightIcon} /> : <span className={classes.rightIcon}>&nbsp;&nbsp;</span> }
          </Button>
          { !item.linkParent && (
            <Popper
              open={openMenu.indexOf(item.key) > -1}
              transition
              disablePortal
              anchorEl={anchorEl}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  id="menu-list-grow"
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                  <Paper className={classes.dropDownMenu}>
                    <ClickAwayListener onClickAway={handleClose}>
                      <List role="menu" component="nav" className={classes.paperMenu}>
                        { getMenus(item.key, item.child) }
                      </List>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          )}
        </div>
      );
    }
    if (item.title) {
      return (
        <ListSubheader component="div" key={index.toString()} className={classes.title}>
          {
            messages[item.key] !== undefined
              ? <FormattedMessage {...messages[item.key]} />
              : item.name
          }
        </ListSubheader>
      );
    }
    return (
      <ListItem
        key={index.toString()}
        button
        className={cx(classes.menuItem, (item.link === '/app' && location.pathname !== '/app') ? 'rootPath' : '')}
        component={LinkBtn}
        to={item.link}
        onClick={() => handleActiveParent(parent)}
      >
        <ListItemText
          primary={
            messages[item.key] !== undefined
              ? intl.formatMessage(messages[item.key])
              : item.name
          }
        />
      </ListItem>
    );
  });

  return (
    <nav className={classes.mainMenu}>
      <div>
        {getMenus(null, dataMenu)}
      </div>
    </nav>
  );
}

MainMenu.propTypes = {
  dataMenu: PropTypes.array.isRequired,
  intl: PropTypes.object.isRequired
};

export default injectIntl(MainMenu);
