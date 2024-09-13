// InvoiceForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const InvoiceForm = () => {
  const [invoiceData, setInvoiceData] = useState({
    clientName: '',
    amount: '',
    dueDate: '',
    description: ''
  });

  const base_url = "https://option-backend.onrender.com"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({
      ...invoiceData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await axios.post(`${base_url}/invoices`, invoiceData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Invoice created:', response.data);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4, p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
        <Typography style={{color : "black"}} variant="h4" component="h1" gutterBottom>
          Create Invoice
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Client Name"
            name="clientName"
            value={invoiceData.clientName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={invoiceData.amount}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            value={invoiceData.dueDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            label="Description"
            name="description"
            value={invoiceData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create Invoice
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default InvoiceForm;
