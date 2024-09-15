// InvoiceForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, IconButton, Grid, MenuItem, Select, FormControl,InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove'
import './Product.css';

const InvoiceForm = () => {
  const [invoiceData, setInvoiceData] = useState({
    Pname: [''],
    Pamount: [''],
    customerName: '',
    mobileNumber:'',
    paymentMethod:'',
    Delivery:'',
    Return:''
  });

  const base_url = "https://option-backend.onrender.com"

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'Pname' || name === 'Pamount') {
      const list = [...invoiceData[name]];
      list[index] = value;
      setInvoiceData({
        ...invoiceData,
        [name]: list
      });
    } else {
      setInvoiceData({
        ...invoiceData,
        [name]: value
      });
    }
  };
  const handleAddClick = () => {
    setInvoiceData({
      ...invoiceData,
      Pname: [...invoiceData.Pname, ''],
      Pamount: [...invoiceData.Pamount, '']
    });
  };

  const handleRemoveClick = (index) => {
    const PnameList = [...invoiceData.Pname];
    const PamountList = [...invoiceData.Pamount];
    PnameList.splice(index, 1);
    PamountList.splice(index, 1);
    setInvoiceData({
      ...invoiceData,
      Pname: PnameList,
      Pamount: PamountList
    });
  };

  const formateDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear());
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedInvoiceData = {
        ...invoiceData,
        Pamount: invoiceData.Pamount.map(amount => Number(amount)), // Convert each Pamount value to a number
        Return: formateDate(invoiceData.Return),
        Delivery: formateDate(invoiceData.Delivery)
      };
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await axios.post(`${base_url}/invoices`,updatedInvoiceData, {
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
      <Box className="container">
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Invoice Details
      </Typography>
      {invoiceData.Pname.map((_, index) => (
        <Grid container spacing={2} key={index} alignItems="center">
          <Grid item xs={5}>
            <TextField
              label="Product"
              name="Pname"
              value={invoiceData.Pname[index]}
              onChange={(e) => handleChange(e, index)}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              label="Amount"
              name="Pamount"
              type="number"
              value={invoiceData.Pamount[index]}
              onChange={(e) => handleChange(e, index)}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={2}>
            {invoiceData.Pname.length > 1 && (
              <IconButton onClick={() => handleRemoveClick(index)}>
                <RemoveIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      ))}
      <IconButton onClick={handleAddClick}>
        <AddIcon />
      </IconButton>
      <TextField
        label="Customer Name"
        name="customerName"
        value={invoiceData.customerName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Mobile Number"
        name="mobileNumber"
        value={invoiceData.mobileNumber}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal" className="textField">
            <InputLabel className="textField">Payment Method</InputLabel>
            <Select
              name="paymentMethod"
              value={invoiceData.paymentMethod}
              onChange={handleChange}
              className="textField"
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Bank">Bank</MenuItem>
              
            </Select>
      </FormControl>
      <TextField
            label="Delivery Date"
            name="Delivery"
            type="date"
            value={invoiceData.Delivery}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
      />
      <TextField
            label="Return Date"
            name="Return"
            type="date"
            value={invoiceData.Return}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
      />
      <TextField
        type='hidden'
        name="total"
        value={invoiceData.total}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
      </Box>
    </Container>
  );
};

export default InvoiceForm;
