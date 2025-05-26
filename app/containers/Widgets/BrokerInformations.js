import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
} from '@mui/material';
import { getBrokerInformations } from '../../middlewares/interceptors';

const BrokerInformations = () => {
  const [brokerData, setBrokerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrokerData = async () => {
      try {
        const res = await getBrokerInformations();
        setBrokerData(res?.data || []);
      } catch (error) {
        console.error('Error fetching broker info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrokerData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>

      {brokerData.map((sponsor) => (
        <Card key={sponsor.sponsor_id} variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" color="primary">
              Sponsor: {sponsor.sponsor_name} ({sponsor.sponsor_id})
            </Typography>

            <Grid container spacing={2} mt={1}>
              {sponsor.brokers.map((broker) => (
                <Grid item xs={12} md={6} key={broker._id}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography>
                      <strong>Broker Name:</strong> {broker.brokerName}
                    </Typography>
                    <Typography>
                      <strong>Server ID:</strong> {broker.serverId}
                    </Typography>
                    <Typography>
                      <strong>User ID:</strong> {broker.userId}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default BrokerInformations;
