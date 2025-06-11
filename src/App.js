import './App.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';
import { BrokerRegistration, Login, SignUp } from './components/Auth';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

import GuestRoute from './components/Common/GuestRoute';
import { Home } from './components/home';
import Layout from './components/Layout/Layout';
import Profile from './components/Profile/Profile';
import ProtectedRoute from './components/Common/ProtectedRoute';
import React from 'react';
import StockManagement from './components/StockManagement/StockManagement';
import { Toaster } from 'react-hot-toast';
import TradeManagement from './components/TradeManagement/TradeManagement';

function RouteWrapper() {
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const { loading } = useAuth();
    
    const defaultProps = {
        location, params, navigate
    };
    
    console.log("returning RouteWrapper")
    
    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }
    
    return (
        <Routes>
            {/* Guest Only Routes (redirect authenticated users) */}
            <Route 
                path="/login" 
                element={
                    <GuestRoute>
                        <Login />
                    </GuestRoute>
                } 
            />
            <Route 
                path="/signup" 
                element={
                    <GuestRoute>
                        <SignUp />
                    </GuestRoute>
                } 
            />
            
            {/* Public Routes */}
            <Route path="/home" element={<Home />} />
            
            {/* Protected Routes with Layout */}
            <Route 
                path="/broker-registration" 
                element={
                    <ProtectedRoute>
                        <Layout>
                            <BrokerRegistration />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/stock-management" 
                element={
                    <ProtectedRoute>
                        <Layout>
                            <StockManagement {...defaultProps} />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/trade-management" 
                element={
                    <ProtectedRoute>
                        <Layout>
                            <TradeManagement {...defaultProps} />
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

            
            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
}

function App() {
  console.log("Returning App")
    return (
        <div className="App">
            <AuthProvider>
                <Router>
                    <RouteWrapper />
                </Router>
            </AuthProvider>
            {/* Toast Container */}
            <Toaster />
        </div>
    );
}

export default App;
