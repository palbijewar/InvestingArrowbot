import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { Cover } from 'enl-components';
import { injectIntl } from 'react-intl';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function TabContainer(props) {
  const { children } = props;
  return (
    <div style={{ paddingTop: 8 * 3 }}>
      {children}
    </div>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

function UserProfile() {
  const title = brand.name + ' - Profile';
  const description = brand.desc;
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedSponsorDetails = localStorage.getItem('sponsor_details');
    if (storedSponsorDetails) {
      const parsed = JSON.parse(storedSponsorDetails);
      setUser(parsed);
    }
  }, []);

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <Cover
        coverImg=""
        avatar={user.avatar || '/default-avatar.png'}
        name={user.username || user.name || 'Guest User'}
        desc={user.email || 'Welcome to your profile'}
        phone={user.phone || '0000-000-000'}
      />
      {user.phone && (
        <Box sx={{ padding: 2 }}>
          <Typography variant="body1"><strong>Phone:</strong> {user.phone}</Typography>
        </Box>
      )}
    </div>
  );
}

UserProfile.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(UserProfile);
