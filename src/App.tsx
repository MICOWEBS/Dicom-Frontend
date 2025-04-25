import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DicomPage } from './pages/DicomPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PrivateRoute } from './components/PrivateRoute';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { UploadZone } from './components/UploadZone';
import { DicomViewer } from './components/DicomViewer';
import { AIResultPanel } from './components/AIResultPanel';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
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
      </AuthProvider>
    </Router>
  );
};

export default App;
