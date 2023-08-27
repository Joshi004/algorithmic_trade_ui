import './App.css';
import React from 'react';
import Home from './components/home/home';
import { BrowserRouter as Router, Routes, Route, Navigate,useLocation,useParams,useNavigate } from 'react-router-dom';
import StockManagement from './components/StockManagement/StockManagement';
import TradeManagement from './components/TradeManagement/TradeManagement';
import ProfileManagement from './components/ProfileManagement/ProfileManagement';

function RouteWrapper() {
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const defaultProps = {
        location, params,navigate
    };
    console.log("returning RoterWraper")
    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/stock-management" element={<StockManagement {...defaultProps} />} />
            <Route path="/trade-management" element={<TradeManagement {...defaultProps} />} />
            <Route path="/profile-management/*" element={<ProfileManagement {...defaultProps} />} />
            <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
    );
}

function App() {
  console.log("Returning App")
    return (
        <div className="App">
            <Router>
                <RouteWrapper />
            </Router>
        </div>
    );
}

export default App;
