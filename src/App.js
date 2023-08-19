import './App.css';
import React, { useEffect,useNavigate } from 'react';
import Home from './components/home/home';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import GenericTable from './components/table/table'
import StockManagement from './components/StockManagement/StockManagement';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/home" element={<Home/>} />
          <Route path="/stock-management" element={<StockManagement/>} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
    </Router>
    </div>
  );
}

export default App;
