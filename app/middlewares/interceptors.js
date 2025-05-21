import axios from 'axios';

const API_BASE_URL = 'https://investing-arrow-backend.onrender.com';

const interceptorInstance = axios.create({
  baseURL: API_BASE_URL,
});

interceptorInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error :', error.message);
    return Promise.reject(error);
  }
);

interceptorInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized! Redirecting to login...');
      localStorage.removeItem('access_token');
    }
    return Promise.reject(error);
  }
);

export default interceptorInstance;

export const getSponsorDetails = async (sponsorId) => {
  try {
    const response = await interceptorInstance.get(`/auth/sponsor-details/${sponsorId}`);
    return response.data;
  } catch (error) {
    console.error('Get Sponsor Details error:', error.response?.data || error.message);
    throw error;
  }
};

export const loginService = async (credentials) => {
  try {
    const response = await interceptorInstance.post(
      '/auth/login',
      credentials,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const token = response.data?.data?.access_token;
    if (token) {
      localStorage.setItem('access_token', token);

      const sponsorDetails = await getSponsorDetails(credentials.sponsor_id);

      localStorage.setItem('sponsor_details', JSON.stringify(sponsorDetails?.data));
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Login error:', error.response?.data || error.message);
    } else {
      console.error('Login error:', error);
    }
    throw error;
  }
};

export const signUpUser = async (formData) => {
  const reqBody = {
    sponsor_id: formData?.sponsor_id,
    username: formData?.username,
    email: formData?.email,
    password: formData?.password,
    confirm_password: formData?.confirm_password,
    referred_by: formData?.referralSponsorId,
    phone: formData?.phone,
  };

  try {
    const response = await interceptorInstance.post('/auth/signup', reqBody);

    if (reqBody.sponsor_id) {
      const sponsorDetails = await getSponsorDetails(reqBody.referred_by);

      localStorage.setItem('sponsor_details', JSON.stringify(sponsorDetails?.data));
    }

    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Signup error:', error.response?.data || error.message);
    } else {
      console.error('Signup error:', error);
    }
    throw error;
  }
};

export const getSponsorName = async (referralSponsorId) => {
  try {
    const url = `/auth/sponsors/${referralSponsorId}`;

    const response = await interceptorInstance.get(url);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Get Sponsor Name error:', error.response?.data || error.message);
    } else {
      console.error('Get Sponsor Name error:', error);
    }
    throw error;
  }
};

export const getDirectReferrals = async (sponsorId) => {
  try {
    const response = await interceptorInstance.get(`/auth/referrals/${sponsorId}`);

    return response.data;
  } catch (error) {
    console.error('Direct Referrals error:', error.response?.data || error.message);
    throw error;
  }
};

export const getSecondLevelReferrals = async (sponsorId) => {
  try {
    const response = await interceptorInstance.get(`/auth/referrals/second-level/${sponsorId}`);

    return response.data;
  } catch (error) {
    console.error('Second-Level Referrals error:', error.response?.data || error.message);
    throw error;
  }
};

export const createBroker = async (brokerDetails) => {
  try {
    const response = await interceptorInstance.post('/broker-details', brokerDetails);
    return response.data;
  } catch (error) {
    console.error('Create Broker error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const sponsorDetails = JSON.parse(localStorage.getItem('sponsor_details'));
    const sponsorId = sponsorDetails?.sponsor_id;

    const response = await interceptorInstance.put(`/auth/users/${sponsorId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Update Profile error:', error.response?.data || error.message);
    throw error;
  }
};

export const createPaymentOption = async (userData) => {
  try {
    const response = await interceptorInstance.post('/payment-options', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Create Payment Option error:', error.response?.data || error.message);
    throw error;
  }
};

export const getPaymentOptions = async () => {
  try {
    const response = await interceptorInstance.get('/cards/payment-count');

    return response.data;
  } catch (error) {
    console.error('Second-Level Referrals error:', error.response?.data || error.message);
    throw error;
  }
};

export const getTotalDematFund = async () => {
  try {
    const response = await interceptorInstance.get('/cards/total-fund');

    return response.data;
  } catch (error) {
    console.error('Second-Level Referrals error:', error.response?.data || error.message);
    throw error;
  }
};

export const getReferredSponsorsTotalIncome = async (sponsorId) => {
  try {
    const response = await interceptorInstance.get(`/cards/referred-income/${sponsorId}`);
    return response.data;
  } catch (error) {
    console.error('Referred Sponsors Total Income error:', error.response?.data || error.message);
    throw error;
  }
};

export const getSecondLevelReferralsTotalIncome = async (sponsorId) => {
  try {
    const response = await interceptorInstance.get(`/cards/second-level-income/${sponsorId}`);
    return response.data;
  } catch (error) {
    console.error('Second Level Referrals Total Income error:', error.response?.data || error.message);
    throw error;
  }
};

export const activateUser = async (sponsorId, isActive) => {
  try {
    const response = await interceptorInstance.patch(
      `/auth/activate/${sponsorId}`,
      { is_active: isActive }
    );

    return response.data;
  } catch (error) {
    console.error('Activate/Deactivate User error:', error.response?.data || error.message);
    throw error;
  }
};

export const getAllSponsors = async () => {
  try {
    const response = await interceptorInstance.get('/auth/users');

    return response.data;
  } catch (error) {
    console.error('Second-Level Referrals error:', error.response?.data || error.message);
    throw error;
  }
};

export const getSponsorPdf = async (sponsorId) => {
  try {
    const response = await interceptorInstance.get(`/payment-options/pdf/${sponsorId}`);

    return response.data;
  } catch (error) {
    console.error('Get Sponsor PDF error:', error.response?.data || error.message);
    throw error;
  }
};

export const getUserTransactions = async (sponsorId) => {
  try {
    const response = await interceptorInstance.get(`/transactions/${sponsorId}`);
    return response.data;
  } catch (error) {
    console.error('Get Transactions error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateAmount = async (sponsorId, data) => {
  try {
    const response = await interceptorInstance.patch(`/auth/amount-deposited/${sponsorId}`, data);

    return response.data;
  } catch (error) {
    console.error('Activate User error:', error.response?.data || error.message);
    throw error;
  }
};

export const updatePackage = async (sponsorId, data) => {
  try {
    const response = await interceptorInstance.patch(`/auth/package/${sponsorId}`, data);

    return response.data;
  } catch (error) {
    console.error('Activate User error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateProfit = async (sponsorId, data) => {
  try {
    const response = await interceptorInstance.patch(`/auth/users/profit/${sponsorId}`, data);

    return response.data;
  } catch (error) {
    console.error('Activate User error:', error.response?.data || error.message);
    throw error;
  }
};

// Get Direct Team Count
export const getDirectTeamCount = async (sponsorId) => {
  try {
    const response = await interceptorInstance.get(`/cards/team/direct/${sponsorId}`);
    return response.data;
  } catch (error) {
    console.error('Get Direct Team Count error:', error.response?.data || error.message);
    throw error;
  }
};

// Get Total Downline Team Count
export const getTotalDownlineTeamCount = async (sponsorId) => {
  try {
    const response = await interceptorInstance.get(`/cards/team/downline/${sponsorId}`);
    return response.data;
  } catch (error) {
    console.error('Get Downline Team Count error:', error.response?.data || error.message);
    throw error;
  }
};

export const getDirectPortfolioInvestment = async (sponsorId) => {
  try {
    const response = await interceptorInstance.get(`/cards/direct-portfolio-investment/${sponsorId}`);
    return response.data;
  } catch (error) {
    console.error('Direct Portfolio Investment error:', error.response?.data || error.message);
    throw error;
  }
};

export const getDownlinePortfolioInvestment = async (sponsorId) => {
  try {
    const response = await interceptorInstance.get(`/cards/downline-portfolio-investment/${sponsorId}`);
    return response.data;
  } catch (error) {
    console.error('Downline Portfolio Investment error:', error.response?.data || error.message);
    throw error;
  }
};

export const getBotDirectActivationCount = async (sponsorId) => {
  try {
    const response = await interceptorInstance.get(`/cards/team/direct-bot/${sponsorId}`);
    return response.data;
  } catch (error) {
    console.error('Bot Direct Portfolio Investment error:', error.response?.data || error.message);
    throw error;
  }
};

export const getBotDownlineActivationCount = async (sponsorId) => {
  try {
    const response = await interceptorInstance.get(`/cards/team/downline-bot/${sponsorId}`);
    return response.data;
  } catch (error) {
    console.error('Bot Downline Portfolio Investment error:', error.response?.data || error.message);
    throw error;
  }
};

export const getBotDirectPortfolioInvestment = async (sponsorId) => {
  try {
    const response = await interceptorInstance.get(`/cards/bot-direct/${sponsorId}`);
    return response.data;
  } catch (error) {
    console.error('Bot Direct Portfolio Investment error:', error.response?.data || error.message);
    throw error;
  }
};

export const getBotDownlinePortfolioInvestment = async (sponsorId) => {
  try {
    const response = await interceptorInstance.get(`/cards/bot-downline/${sponsorId}`);
    return response.data;
  } catch (error) {
    console.error('Bot Downline Portfolio Investment error:', error.response?.data || error.message);
    throw error;
  }
};

export const getRankInformations = async (sponsorId) => {
  try {
    const response = await interceptorInstance.get(`/cards/ranks/${sponsorId}`);
    return response.data;
  } catch (error) {
    console.error('Bot Downline Portfolio Investment error:', error.response?.data || error.message);
    throw error;
  }
};

export const getBrokerInformations = async () => {
  try {
    const response = await interceptorInstance.get('/broker-details');
    return response.data;
  } catch (error) {
    console.error('Bot Downline Portfolio Investment error:', error.response?.data || error.message);
    throw error;
  }
};

export const getProfitSummary = async (sponsorId) => {
  try {
    const response = await interceptorInstance.get(`/auth/users/profit-summary/${sponsorId}`);
    return response.data;
  } catch (error) {
    console.error('Get Direct Team Count error:', error.response?.data || error.message);
    throw error;
  }
};
