import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const Product = () => {
  const [formData, setFormData] = useState({
    code: '',
    color: '',
    endDate: '',
    size: '',
    startDate: '',
    status: '',
    time: ''
  });
  const token = localStorage?.getItem('token')

  const [inventory, setInventory] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if(!token)
    {
      window.location.href = '/login'
    }
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      let response = await axios.get(`http://localhost:8000/getRantedInventory`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setInventory(response.data);
      console.log(response);
      
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:8000/updateInventory/${editId}`, formData, {
          headers: {
            'Authorization' : `Bearer ${token}`
          }
        });
      } else {
        await axios.post(`http://localhost:8000/addData`, formData, {
          headers: {
            'Authorization' : `Bearer ${token}`
          }
        });
      }
      fetchInventory();
      setFormData({
        code: '',
        color: '',
        endDate: '',
        size: '',
        startDate: '',
        status: '',
        time: ''
      });
      setEditId(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/deleteInventory/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchInventory();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  console.log(inventory);
  

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Inventory Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Date"
            name="endDate"
            type="datetime-local"
            value={formData.endDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Date"
            name="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            {editId ? 'Update' : 'Submit'}
          </Button>
        </form>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Inventory List
          </Typography>
          {inventory?.data?.map((item) => (
            <Box key={item.id} sx={{ mb: 2 }}>
              <Typography variant="body1">Code: {item.code}</Typography>
              <Typography variant="body1">Color: {item.color}</Typography>
              <Typography variant="body1">End Date: {item.endDate}</Typography>
              <Typography variant="body1">Size: {item.size}</Typography>
              <Typography variant="body1">Start Date: {item.startDate}</Typography>
              <Typography variant="body1">Status: {item.status}</Typography>
              <Typography variant="body1">Time: {item.time}</Typography>
              <Button variant="contained" color="secondary" onClick={() => handleEdit(item)} sx={{ mt: 1, mr: 1 }}>
                Edit
              </Button>
              <Button variant="contained" color="error" onClick={() => handleDelete(item.id)} sx={{ mt: 1 }}>
                Delete
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Product;
