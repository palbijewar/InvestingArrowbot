import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { injectIntl, FormattedMessage } from 'react-intl';
import { openAction } from 'enl-redux/modules/ui';
import messages from 'enl-api/ui/menuMessages';
import useStyles from './sidebar-jss';

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) { // eslint-disable-line
  return <NavLink to={props.to} {...props} />; // eslint-disable-line
});

// eslint-disable-next-line
function MainMenu(props) {
  const { classes, cx } = useStyles();
  const location = useLocation();
  const {
    dataMenu,
    toggleDrawerOpen,
    loadTransition,
    intl
  } = props;

  const dispatch = useDispatch();
  const open = useSelector((state) => state.ui.subMenuOpen);

  const handleTransition = () => {
    toggleDrawerOpen();
    loadTransition(false);
  };

  const handleOpenMenu = (key, keyParent) => {
    dispatch(openAction({ key, keyParent }));
  };

  const getMenus = (menuArray, paddingLevel) => menuArray.map((item, index) => {
    if (item.child || item.linkParent) {
      return (
        <div key={index.toString()}>
          <ListItem
            button
            to={item.linkParent ? item.linkParent : '#'}
            sx={{ marginLeft: !item.icon ? paddingLevel : 0 }}
            className={
              cx(
                classes.head,
                item.icon ? classes.iconed : '',
                open.indexOf(item.key) > -1 ? classes.opened : '',
              )
            }
            onClick={() => handleOpenMenu(item.key, item.keyParent)}
          >
            {item.icon && (
              <ListItemIcon className={classes.icon}>
                <Icon>{item.icon}</Icon>
              </ListItemIcon>
            )}
            <ListItemText
              classes={{ primary: classes.primary }}
              primary={
                messages[item.key] !== undefined
                  ? intl.formatMessage(messages[item.key])
                  : item.name
              }
            />
            { !item.linkParent && (
              <span>
                { open.indexOf(item.key) > -1 ? <ExpandLess /> : <ExpandMore /> }
              </span>
            )}
          </ListItem>
          { !item.linkParent && (
            <Collapse
              component="div"
              className={cx(
                classes.nolist,
                (item.keyParent ? classes.child : ''),
              )}
              in={open.indexOf(item.key) > -1}
              timeout="auto"
              unmountOnExit
            >
              <List className={classes.dense} component="nav">
                { getMenus(item.child, item.level) }
              </List>
            </Collapse>
          )}
        </div>
      );
    }
    if (item.title) {
      return (
        <ListSubheader
          disableSticky
          key={index.toString()}
          component="div"
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
        className={cx(classes.nested, (item.link === '/app' && location.pathname !== '/app') ? 'rootPath' : '')}
        component={NavLink}
        to={item.link}
        onClick={() => handleTransition()}
      >
        <Box
          sx={{
            flex: 1,
            pl: paddingLevel,
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <ListItemText
            classes={{ primary: classes.primary }}
            primary={
              messages[item.key] !== undefined
                ? intl.formatMessage(messages[item.key])
                : item.name
            }
          />
          {item.badge && (
            <Chip color="primary" label={item.badge} className={classes.badge} />
          )}
        </Box>
      </ListItem>
    );
  });

  return (
    <div>
      {getMenus(dataMenu)}
    </div>
  );
}

MainMenu.propTypes = {
  toggleDrawerOpen: PropTypes.func.isRequired,
  loadTransition: PropTypes.func.isRequired,
  dataMenu: PropTypes.array.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(MainMenu);
