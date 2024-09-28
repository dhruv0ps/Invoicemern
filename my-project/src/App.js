import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Invoices from './components/Invoicedetail';
import Invoiceform from './pages/Invoiceform';
import InvoiceDetail from './components/Invoicedetail';

function App() {
  const location = useLocation();
  
  
  const isAuthenticated = () => {
   
    return localStorage.getItem('token') !== null; 
  };

  return (
    <>
    <Navbar/>
      <Routes>
       
        <Route path="/" element={isAuthenticated() ? <Navigate to="/invoiceform" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/invoicedetail/:id" element={<InvoiceDetail />} />
        
        <Route path="/invoiceform" element={<Invoiceform />} />
      </Routes>
    </>
  );
}

const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
