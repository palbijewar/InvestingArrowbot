import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardContent, Typography, IconButton, Tooltip
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { injectIntl } from 'react-intl';
import PapperBlock from '../PapperBlock/PapperBlock';
import useStyles from './widget-jss';
import qrCodeImage from '../../api/images/qr.jpg';

function QRCodeWidget(props) {
  const { intl } = props;
  const { classes } = useStyles();

  const walletAddress = 'TR34MGSRAGWKVJvtfCY5XyTjD4gXvSZGuD';
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={qrCodeImage} alt="QR Code" className={classes.qrImage} />
          </div>
          <Typography variant="body1" align="center" gutterBottom>
    Scan this QR code for payment details.
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {walletAddress}
            </Typography>
            <Tooltip title={copySuccess ? 'Copied!' : 'Copy'}>
              <IconButton onClick={handleCopy} size="small">
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        </CardContent>

      </Card>
    </PapperBlock>
  );
}

QRCodeWidget.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(QRCodeWidget);
