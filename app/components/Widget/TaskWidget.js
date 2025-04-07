import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardContent, Typography, IconButton, Tooltip, Box
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
          <Box display="flex" justifyContent="center" mb={2}>
            <img
              src={qrCodeImage}
              alt="Scan this QR code for TRC20 Tether payment"
              className={classes.qrImage}
              style={{ maxWidth: 200, width: '100%' }}
            />
          </Box>

          <Typography variant="body1" align="center" gutterBottom>
            <strong>Note:</strong> Only send Tether (TRC20) assets to this address.
            <br />
            Scan this QR code for payment details.
          </Typography>

          <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
            <Typography
              variant="body2"
              sx={{ wordBreak: 'break-all', textAlign: 'center', mr: 1 }}
            >
              {walletAddress}
            </Typography>
            <Tooltip title={copySuccess ? 'Copied!' : 'Copy'}>
              <IconButton onClick={handleCopy} size="small" aria-label="Copy wallet address">
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </PapperBlock>
  );
}

QRCodeWidget.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(QRCodeWidget);
