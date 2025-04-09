import React, {
  useRef,
  useEffect,
  useState
} from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import MainMenu from './MainMenu';
import useStyles from './sidebar-jss';

function SidebarContent(props) {
  const { classes, cx } = useStyles();
  const {
    drawerPaper,
    toggleDrawerOpen,
    loadTransition,
    leftSidebar,
    dataMenu,
  } = props;
  const [setTransform] = useState(0);
  const refSidebar = useRef(null);

  const handleScroll = (event) => {
    setTransform(event.target.scrollTop);
  };

  useEffect(() => {
    refSidebar.current.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={cx(classes.drawerInner, !drawerPaper ? classes.drawerPaperClose : '')}>
      <div className={classes.drawerHeader}>
      </div>
      <div
        id="sidebar"
        ref={refSidebar}
        className={
          cx(
            classes.menuContainer,
            leftSidebar && classes.rounded,
            classes.withProfile
          )
        }
      >
        <MainMenu loadTransition={loadTransition} dataMenu={dataMenu} toggleDrawerOpen={toggleDrawerOpen} />
      </div>
    </div>
  );
}

SidebarContent.propTypes = {
  userAttr: PropTypes.object.isRequired,
  drawerPaper: PropTypes.bool.isRequired,
  toggleDrawerOpen: PropTypes.func,
  loadTransition: PropTypes.func,
  leftSidebar: PropTypes.bool.isRequired,
  dataMenu: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  anchorEl: PropTypes.object,
  openMenuStatus: PropTypes.func.isRequired,
  closeMenuStatus: PropTypes.func.isRequired,
  changeStatus: PropTypes.func.isRequired,
};

SidebarContent.defaultProps = {
  toggleDrawerOpen: () => {},
  toggleDrawerClose: () => {},
  loadTransition: () => {},
  anchorEl: null,
};

export default injectIntl(SidebarContent);
