import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography } from '@mui/material';
import { injectIntl } from 'react-intl';
import PapperBlock from '../PapperBlock/PapperBlock';
import useStyles from './widget-jss';
import qrCodeImage from '../../api/images/qr.jpg';

function QRCodeWidget(props) {
  const { intl } = props;
  const { classes } = useStyles();

  return (
    <PapperBlock
      title={intl.formatMessage({ id: 'qr_code_title', defaultMessage: 'QR Code' })}
      icon="qr_code"
      noMargin
      whiteBg
      colorMode="dark"
      className={classes.root}
    >
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <img src={qrCodeImage} alt="QR Code" className={classes.qrImage} />
          <Typography variant="body1" align="center">
            Scan this QR code for payment details.
          </Typography>
        </CardContent>
      </Card>
    </PapperBlock>
  );
}

QRCodeWidget.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(QRCodeWidget);
