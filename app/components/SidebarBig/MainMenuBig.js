import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ButtonBase from '@mui/material/ButtonBase';
import Icon from '@mui/material/Icon';
import { openAction, openMenuAction, closeMenuAction } from 'enl-redux/modules/ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from 'enl-api/ui/menuMessages';
import useStyles from './sidebarBig-jss';

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) { // eslint-disable-line
  return <NavLink to={props.to} {...props} />; // eslint-disable-line
});

function MainMenuBig(props) { // eslint-disable-line
  const { classes, cx } = useStyles();
  const {
    intl,
    mobile,
    loadTransition,
    toggleDrawerOpen,
    dataMenu,
    drawerPaper
  } = props;

  const location = useLocation();
  const dispatch = useDispatch();
  const open = useSelector((state) => state.ui.subMenuOpen);

  const [selectedMenu, setSelectedMenu] = useState([]);
  const [menuLoaded, setMenuLoaded] = useState(true);

  const handleLoadMenu = (menu, key) => {
    setSelectedMenu(menu);
    setMenuLoaded(false);
    dispatch(openAction({ key }));

    setTimeout(() => {
      setMenuLoaded(true); // load transtion menu
    }, 100);
    // Unecessary in mobile, because toggle menu already handled
    if (!mobile) {
      dispatch(openMenuAction());
    }
  };

  const handleLoadSingleMenu = () => {
    setSelectedMenu([]);
    dispatch(closeMenuAction());
  };

  const handleLoadPage = () => {
    toggleDrawerOpen();
    loadTransition(false);
  };

  const currentMenu = dataMenu.filter(item => item.key === open[0]);
  const activeMenu = (key, child) => {
    if (selectedMenu.length < 1) {
      if (open.indexOf(key) > -1) {
        return true;
      }
      return false;
    }
    if (child === selectedMenu) {
      return true;
    }
    return false;
  };

  const getMenus = menuArray => menuArray.map((item, index) => {
    if (item.key === 'menu_levels') {
      return false;
    }
    if (item.child) {
      return (
        <ButtonBase
          key={index.toString()}
          focusRipple
          onClick={() => handleLoadMenu(item.child, item.key)}
          className={
            cx(
              classes.menuHead,
              activeMenu(item.key, item.child) ? 'active' : ''
            )
          }
        >
          <Icon className={classes.icon}>{item.icon}</Icon>
          <span className={classes.text}>
            {
              messages[item.key] !== undefined
                ? <FormattedMessage {...messages[item.key]} />
                : item.name
            }
          </span>
        </ButtonBase>
      );
    }
    return (
      <ButtonBase
        key={index.toString()}
        focusRipple
        className={cx(classes.menuHead, (item.link === '/app' && location.pathname !== '/app') ? 'rootPath' : '')}
        component={NavLink}
        to={item.linkParent}
        onClick={() => handleLoadSingleMenu(item.key)}
      >
        <Icon className={classes.icon}>{item.icon}</Icon>
        <span className={classes.text}>
          {
            messages[item.key] !== undefined
              ? <FormattedMessage {...messages[item.key]} />
              : item.name
          }
        </span>
      </ButtonBase>
    );
  });

  const getChildMenu = menuArray => menuArray.map((item, index) => {
    if (item.title) {
      return (
        <ListSubheader
          key={index.toString()}
          disableSticky
          className={classes.title}
        >
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
        className={cx(classes.item, (item.link === '/app' && location.pathname !== '/app') ? 'rootPath' : '')}
        component={LinkBtn}
        to={item.link}
        onClick={() => handleLoadPage()}
      >
        <ListItemIcon>
          <Icon className={classes.icon}>{item.icon}</Icon>
        </ListItemIcon>
        <ListItemText
          className={classes.text}
          primary={
            messages[item.key] !== undefined
              ? intl.formatMessage(messages[item.key])
              : item.name
          }
        />
      </ListItem>
    );
  });

  const renderChildMenu = () => {
    if (selectedMenu.length < 1) {
      return (
        <List dense className={classes.fixedWrap}>
          {currentMenu.length > 0 ? getChildMenu(currentMenu[0].child) : ''}
        </List>
      );
    }
    return (
      <List
        dense
        className={
          cx(
            classes.fixedWrap,
            classes.childMenuWrap,
            menuLoaded && classes.menuLoaded
          )
        }
      >
        {getChildMenu(selectedMenu)}
      </List>
    );
  };

  return (
    <aside className={classes.bigSidebar}>
      <nav className={classes.category}>
        <div className={classes.fixedWrap}>
          {getMenus(dataMenu)}
        </div>
      </nav>
      <nav className={cx(classes.listMenu, !drawerPaper && classes.drawerPaperClose)}>
        {renderChildMenu()}
      </nav>
    </aside>
  );
}

MainMenuBig.propTypes = {
  userAttr: PropTypes.object.isRequired,
  dataMenu: PropTypes.array.isRequired,
  loadTransition: PropTypes.func.isRequired,
  drawerPaper: PropTypes.bool.isRequired,
  mobile: PropTypes.bool,
  toggleDrawerOpen: PropTypes.func,
  intl: PropTypes.object.isRequired
};

MainMenuBig.defaultProps = {
  toggleDrawerOpen: () => {},
  mobile: false
};

export default injectIntl(MainMenuBig);
