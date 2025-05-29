import './App.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';
import { BrokerRegistration, Login, SignUp } from './components/Auth';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

import { Home } from './components/home';
import ProfileManagement from './components/ProfileManagement/ProfileManagement';
import React from 'react';
import StockManagement from './components/StockManagement/StockManagement';
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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/broker-registration" element={<BrokerRegistration />} />
            <Route path="/home" element={<Home />} />
            <Route path="/stock-management" element={<StockManagement {...defaultProps} />} />
            <Route path="/trade-management" element={<TradeManagement {...defaultProps} />} />
            <Route path="/profile-management/*" element={<ProfileManagement {...defaultProps} />} />
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
        </div>
    );
}

export default App;
