import React, { useEffect, useState } from 'react';
import './Dashbord.css';
import axios from 'axios';

const Dashbord = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [todaydelivery, settodaydelivery] = useState(0);
  const [todayreturn, settodayreturn] = useState(0);
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = currentDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  useEffect(() => {
    const token = localStorage?.getItem('token');
    if (!token) {
      window.location.href = '/login';
    } else {
      const fetchData = async () => {
        try {
          let response = await axios.get(`http://localhost:8000/dashboard`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setDashboardData(response.data.data);
          console.log(response.data.data);
        } catch (error) {
          console.error('Error fetching dashboard data', error);
        }
      };
      fetchData();
    }
  }, []);


  console.log(dashboardData);
  


  useEffect(() => {
    if (dashboardData) {
      let count = 0;
      dashboardData.forEach((v) => {
        if (formattedDate === v.endDate) {
          count++;
        }
      });
      settodayreturn(count);
    }
  }, [dashboardData]);

  
  

  useEffect(() => {
    if (dashboardData) {
      let count = 0;
      dashboardData.forEach((v) => {
        if (formattedDate === v.startDate) {
          count++;
        }
      });
      settodaydelivery(count);
    }
  }, [dashboardData]);

  return (
    <div className="dashboard-container">
      <h1 className='title'>Dashboard</h1>
      <div className="dashboard-section">
        <h2>Today's Booking</h2>
        <p>{todaydelivery}</p>
      </div>
      <div className="dashboard-section">
        <h2>Today's Delivery</h2>
        <p>{todaydelivery}</p>
      </div>
      <div className="dashboard-section">
        <h2>Today's Return</h2>
        <p>{todayreturn}</p>
      </div>
      <div className="dashboard-section">
        <h2>Total Product in Cart</h2>
        <p>{dashboardData?.length}</p>
      </div>
    </div>
  );
};

export default Dashbord;
