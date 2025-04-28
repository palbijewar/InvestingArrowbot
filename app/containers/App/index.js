import React from 'react';
import { PropTypes } from 'prop-types';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Corporate from '../Templates/Corporate';
import Outer from '../Templates/Outer';
import Application from './Application';
import ThemeWrapper from './ThemeWrapper';
import ProtectedRoute from './ProtectedRoute';

import {
  HomePage, Register,
  LoginFullstack, RegisterFullstack,
  ResetPassword, ResetPasswordFullstack,
  LockScreen, ComingSoon,
  Maintenance, TermsConditions,
  NotFoundDedicated,
  EditProfile,
  LandingPage
} from '../pageListAsync';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

function App(props) {
  const { history } = props;

  return (
    <ThemeWrapper>
      <BrowserRouter>
        <Routes>
          <Route path="/corporate" element={<Corporate />}>
            <Route index element={<HomePage />} />
          </Route>

          <Route
            path="app/*"
            element={
              <ProtectedRoute>
                <Application history={history} />
              </ProtectedRoute>
            }
          />

          <Route element={<Outer />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="login" element={<LoginFullstack />} />
            <Route path="register" element={<Register />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="login-firebase" element={<LoginFullstack />} />
            <Route path="register-firebase" element={<RegisterFullstack />} />
            <Route path="reset-firebase" element={<ResetPasswordFullstack />} />
            <Route path="lock-screen" element={<LockScreen />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="coming-soon" element={<ComingSoon />} />
            <Route path="terms-conditions" element={<TermsConditions />} />
          </Route>

          <Route path="*" element={<NotFoundDedicated />} />
        </Routes>
      </BrowserRouter>
    </ThemeWrapper>
  );
}

App.propTypes = {
  history: PropTypes.object.isRequired,
};

export default App;
