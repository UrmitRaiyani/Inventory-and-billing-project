import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import './Product.css';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Product = () => {
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [subDropdownOptions, setSubDropdownOptions] = useState([]);
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    code: '',
    color: '',
    endDate: '',
    size: '',
    startDate: '',
    time: '',
    mainDropdown: '',
    subName: ''
  });



  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const fetchDropdownOptions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/getDropdowns');
      console.log(response);

      setDropdownOptions(response.data);
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  const fetchSubDropdownOptions = async (selectedValue) => {
    console.log(selectedValue);

    try {
      const response = await axios.get(`http://localhost:8000/getSubDropdowns?mainDropdownId=${selectedValue}`);
      console.log(response.data);
      setSubDropdownOptions(response?.data);
    } catch (error) {
      console.error('Error fetching sub-dropdown options:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'mainDropdown') {
      fetchSubDropdownOptions(value);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        endDate: formatDate(formData.endDate),
        startDate: formatDate(formData.startDate)
      };
      await axios.post('http://localhost:8000/addData', formattedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Product added successfully!', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      setFormData({
        code: '',
        color: '',
        endDate: '',
        size: '',
        startDate: '',
        time: '',
        mainDropdown: '',
        subName: ''
      });
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  console.log(formData);
  



  return (
    <Container maxWidth="sm">
      <Box className="container">
        <Typography variant="h4" gutterBottom className="titlee">
          Add Data
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            fullWidth
            margin="normal"
            className="textField"
            InputLabelProps={{ className: 'textField' }}
            InputProps={{ className: 'textField' }}
          />
          <TextField
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            fullWidth
            margin="normal"
            className="textField"
            InputLabelProps={{ className: 'textField' }}
            InputProps={{ className: 'textField' }}
          />
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            className="textField"
            InputLabelProps={{ shrink: true, className: 'textField' }}
            InputProps={{ className: 'textField' }}
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            className="textField"
            InputLabelProps={{ shrink: true, className: 'textField' }}
            InputProps={{ className: 'textField' }}
          />
          <FormControl fullWidth margin="normal" className="textField">
            <InputLabel className="textField">Size</InputLabel>
            <Select
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="textField"
            >
              <MenuItem value="30">30</MenuItem>
              <MenuItem value="32">32</MenuItem>
              <MenuItem value="34">34</MenuItem>
              <MenuItem value="36">36</MenuItem>
              <MenuItem value="38">38</MenuItem>
              <MenuItem value="40">40</MenuItem>
              <MenuItem value="42">42</MenuItem>
              <MenuItem value="44">44</MenuItem>
              <MenuItem value="46">46</MenuItem>
              <MenuItem value="48">48</MenuItem>
              <MenuItem value="50">50</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" className="textField">
            <InputLabel className="textField">Time</InputLabel>
            <Select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="textField"
            >
              <MenuItem value="morning">Morning</MenuItem>
              <MenuItem value="night">Night</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" className="textField">
            <InputLabel className="textField">Dropdown</InputLabel>
            <Select
              name="mainDropdown"
              value={formData.dropdown}
              onChange={handleChange}
              className="textField"
            >
              {dropdownOptions?.map((option) => (
                <MenuItem key={option._id} value={option?._id}>
                  {option?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" className="textField">
            <InputLabel className="textField">Sub Dropdown</InputLabel>
            <Select
              name="subName"
              value={formData.subDropdown}
              onChange={handleChange}
              className="textField"
            >
              {subDropdownOptions?.map((option) => (
                <MenuItem key={option._id} value={option?.subName}>
                  {option.subName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" className="submitButton">
            Submit
          </Button>
        </form>
        <ToastContainer />
      </Box>
    </Container>

  );
};

export default Product;
