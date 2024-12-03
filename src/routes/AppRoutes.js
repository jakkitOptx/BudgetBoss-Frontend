import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'; // นำเข้า ProtectedRoute

// Pages
import Dashboard from '../pages/Dashboard';
import QuotationManagement from '../pages/QuotationManagement';
import CreateQuotation from '../pages/CreateQuotation';
import EditQuotation from '../pages/EditQuotation';
import QuotationDetails from '../pages/QuotationDetails';
import ApprovalManagement from '../pages/ApprovalManagement';
import UserManagement from '../pages/UserManagement';
import Logs from '../pages/Logs';
import Login from '../pages/Login';
import Profile from '../pages/Profile';

// Components
import Layout from '../components/Layout';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* หน้า Login ไม่ต้องตรวจสอบ Token */}
        <Route path="/login" element={<Login />} />

        {/* หน้าที่ต้องตรวจสอบ Token */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quotations"
          element={
            <ProtectedRoute>
              <Layout>
                <QuotationManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quotations/create"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateQuotation />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quotations/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditQuotation />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quotations/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <QuotationDetails />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/approvals"
          element={
            <ProtectedRoute>
              <Layout>
                <ApprovalManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <ProtectedRoute>
              <Layout>
                <Logs />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
