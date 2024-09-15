import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { FaHome, FaClipboardList, FaCog, FaQuestionCircle, FaInfoCircle, FaBars } from 'react-icons/fa';
import { RiAddCircleFill } from "react-icons/ri";
import './App.css';
import Dashboard from './components/Dashbord';
import Register from './components/Register';
import Login from './components/Login';
import Product from './components/Product';
import Viewproduct from './components/Viewproduct';
import Todaysbooking from './components/Todaysbooking';
import Todaysdelivery from './components/Todaysdelivery';
import Todaysreturn from './components/Todaysreturn';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoicesList';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const token = localStorage?.getItem('token');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };


  return (
    <Router>
      <div className="App">

        {token ?
          <>
            <header className="App-header">
              <div className="header-content">
                {isMobile && <FaBars className="icon" onClick={toggleSidebar} />}
                <div className="logo">MyAdmin</div>
                <button className="cta-button" onClick={handleLogout}>Log Out</button>
              </div>
            </header>
            <div className="App-body">
              <nav className={`sidebar ${isMobile && !sidebarOpen ? 'hidden' : ''}`}>
                <ul>
                  <li><Link to="/dashboard" className="sidebar-link" onClick={closeSidebar}><FaHome /> Dashboard</Link></li>
                  <li><Link to="/product" className="sidebar-link" onClick={closeSidebar}><RiAddCircleFill />Add Product</Link></li>
                  <li><Link to="/viewproduct" className="sidebar-link" onClick={closeSidebar}><FaClipboardList />View Product</Link></li>
                  <li><Link to="/addinvoice" className="sidebar-link" onClick={closeSidebar}><RiAddCircleFill />Add invoice</Link></li>
                  <li><Link to="/adddropdown" className="sidebar-link" onClick={closeSidebar}><RiAddCircleFill />Add cloth</Link></li>
                  <li><Link to="/InvoiceData" className="sidebar-link" onClick={closeSidebar}><RiAddCircleFill />Invoices</Link></li>
                </ul>
              </nav>
              <main className="content">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />  } />
                  <Route path="/product" element={<Product />} />
                  <Route path="/viewproduct" element={<Viewproduct />} />
                  <Route path="/addinvoice" element={<InvoiceForm />} />
                  <Route path="/update/:id" element={<Product />} />
                  <Route path="/todaysbooking" element={<Todaysbooking />} />
                  <Route path="/todaysdelivery" element={<Todaysdelivery />} />
                  <Route path="/todaysreturn" element={<Todaysreturn />} />
                  <Route path="/login" element={<Login/>} />
                  <Route path="/register" element={<Register/>} />
                  <Route path="/InvoiceData" element={<InvoiceList />} />
                </Routes>
              </main>
            </div>
          </>

          :
          <main className="content">
            <Routes>
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        }
      </div>
    </Router>
  );
};

export default App;
