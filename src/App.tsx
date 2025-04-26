import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { DicomPage } from './pages/DicomPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PrivateRoute } from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <SubscriptionProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DicomPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/view/:fileId"
              element={
                <PrivateRoute>
                  <DicomPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/inference/:fileId"
              element={
                <PrivateRoute>
                  <DicomPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SubscriptionProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
