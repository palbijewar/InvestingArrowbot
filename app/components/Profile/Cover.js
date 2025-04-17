import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import VerifiedUser from '@mui/icons-material/VerifiedUser';
import Info from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { injectIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom'; // ✅ import navigate
import useStyles from './cover-jss';

const optionsOpt = [
  'Edit Profile',
  'Change Cover',
];

const ITEM_HEIGHT = 48;

function Cover(props) {
  const [anchorElOpt, setAnchorElOpt] = useState(null);
  const navigate = useNavigate(); // ✅ initialize navigator

  const handleClickOpt = event => {
    setAnchorElOpt(event.currentTarget);
  };

  const handleCloseOpt = () => {
    setAnchorElOpt(null);
  };

  const handleMenuItemClick = (option) => {
    handleCloseOpt();
    if (option === 'Edit Profile') {
      navigate('/edit-profile'); // ✅ redirect on edit profile click
    }
    // Add logic for other menu items if needed
  };

  const { classes } = useStyles();
  const {
    avatar,
    name,
    desc,
    phone,
    coverImg,
  } = props;

  return (
    <div className={classes.cover} style={{ backgroundImage: `url(${coverImg})` }}>
      <div className={classes.opt}>
        <IconButton className={classes.button} aria-label="Info" size="large">
          <Info />
        </IconButton>
        <IconButton
          aria-label="More"
          aria-owns={anchorElOpt ? 'long-menu' : null}
          aria-haspopup="true"
          className={classes.button}
          onClick={handleClickOpt}
          size="large">
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorElOpt}
          open={Boolean(anchorElOpt)}
          onClose={handleCloseOpt}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 200,
            },
          }}
        >
          {optionsOpt.map(option => (
            <MenuItem key={option} onClick={() => handleMenuItemClick(option)}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
      <div className={classes.content}>
        <Avatar alt={name} src={avatar} className={classes.avatar} />
        <Typography variant="h4" className={classes.name} gutterBottom>
          {name}
          <VerifiedUser className={classes.verified} />
        </Typography>
        <Typography className={classes.subheading} gutterBottom>
          {desc}
        </Typography>
        {phone && (
          <Typography className={classes.subheading} gutterBottom>
            📞 {phone}
          </Typography>
        )}
      </div>
    </div>
  );
}

Cover.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  phone: PropTypes.string,
  coverImg: PropTypes.string.isRequired,
};

export default injectIntl(Cover);
