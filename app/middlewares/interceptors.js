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

    if (response.data?.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
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
  };

  try {
    const response = await interceptorInstance.post('/auth/signup', reqBody);
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
