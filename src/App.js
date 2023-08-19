import './App.css';
import React, { useEffect,useNavigate } from 'react';
import Home from './components/home/home';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import GenericTable from './components/table/table'


function App() {
  return (
    <div className="App">
      {/* <Home></Home> */}
      <Router>
        <Routes>
          <Route path="/home" element={<Home/>} />
          <Route path="/stock-management" element={<GenericTable/>} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
    </Router>
    </div>
  );
}

export default App;
