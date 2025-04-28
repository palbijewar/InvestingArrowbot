import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from './messages';
import useStyles from './landingStyle-jss';
import Header from './Header';

function Banner() {
  const { classes, cx } = useStyles();
  const mdDown = useMediaQuery(theme => theme.breakpoints.down('md'));

  return (
    <div className={cx(classes.banner, classes.fit)}>
      <Header turnDarker={false} />
      <svg className={cx(classes.deco, classes.decoLeft)}>
        <use xlinkHref="/images/decoration/hexaDecoration.svg#decoration" />
      </svg>
      <svg className={cx(classes.deco, classes.decoRight)}>
        <use xlinkHref="/images/decoration/hexaDecoration.svg#decoration" />
      </svg>
      <svg className={cx(classes.deco, classes.decoBottom)}>
        <use xlinkHref="/images/decoration/hexaDecoration.svg#decoration" />
      </svg>

      <div className={classes.container}>
        <Typography component="h2" variant="h2" gutterBottom>
          Investing Arrow Bot
        </Typography>
        <Typography component="p" variant="h5" gutterBottom>
        Welcome to investing arrow, join us now!
        </Typography>

        {/* <div className={classes.btnArea}>
          <Button
            size="large"
            variant="outlined"
            color="secondary"
            className={classes.button}
            component={Link}
            to="/register"
          >
            Signup
          </Button>
          <Button
            size="large"
            variant="contained"
            color="secondary"
            className={classes.button}
            component={Link}
            to="/login"
          >
            Login
          </Button>
        </div> */}

        <div className={classes.previewApp}>
          {!mdDown && (
            <>
              <div className={cx(classes.m1, classes.screen)}>
                <img src="https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg" alt="crm dashboard" />
              </div>
              <div className={cx(classes.m2, classes.screen)}>
                <img src="https://t3.ftcdn.net/jpg/04/24/53/50/360_F_424535039_f0HgjloFjZodjP0qDErF6HZrVm7qJ7mo.jpg" alt="crm dashboard" />
              </div>
              <div className={cx(classes.m3, classes.screen)}>
                <img src="https://media.istockphoto.com/id/1304093999/photo/bitcoin-e-commerce-concept-on-digital-screen.jpg?s=612x612&w=0&k=20&c=H_aL2IvK90193-D8LEsuQGpgKYio0-Ls1-DMylZ41bY=" alt="crypto dashboard" />
              </div>
            </>
          )}
          <div className={cx(classes.m4, classes.screen)}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXkIA7Fzl7Zt_R9cGLmvKEAA9RdKjTLhSB4Q&s" alt="personal dashboard" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default injectIntl(Banner);
