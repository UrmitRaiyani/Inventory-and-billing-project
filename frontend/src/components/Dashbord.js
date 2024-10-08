import React, { useEffect, useState, useMemo } from 'react';
import './Dashbord.css';
import axios from 'axios';
import Loader from './Loader';

const Dashbord = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = currentDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const base_url = "https://option-backend.onrender.com";

  useEffect(() => {
    const token = localStorage?.getItem('token');
    if (!token) {
      window.location.href = '/login';
    } else {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${base_url}/dashboard`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setDashboardData(response.data.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching dashboard data', error);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, []);

  const todayreturn = useMemo(() => {
    if (dashboardData) {
      return dashboardData.filter(v => formattedDate === v.endDate).length;
    }
    return 0;
  }, [dashboardData, formattedDate]);

  const todaydelivery = useMemo(() => {
    if (dashboardData) {
      return dashboardData.filter(v => formattedDate === v.startDate).length;
    }
    return 0;
  }, [dashboardData, formattedDate]);

  const todaysbooking = () => {
    window.location.href = '/todaysbooking';
  };

  const todaysdelivery = () => {
    window.location.href = '/todaysdelivery';
  };

  const todaysreturn = () => {
    window.location.href = '/todaysreturn';
  };

  return (
    <div className="dashboard-container">
      {loading && <Loader />}
      <h1 className='title'>Dashboard</h1>
      {/* <div className="dashboard-section" onClick={todaysbooking}>
        <h2>Today's Booking</h2>
        <p>{todaydelivery}</p>
      </div> */}
      <div className="dashboard-section" onClick={todaysdelivery}>
        <h2>Today's Delivery</h2>
        <p>{todaydelivery}</p>
      </div>
      <div className="dashboard-section" onClick={todaysreturn}>
        <h2>Today's Return</h2>
        <p>{todayreturn}</p>
      </div>
    </div>
  );
};

export default Dashbord;
