import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import './Product.css';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

const Product = () => {
  const uid = useParams();
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
    if (uid?.id) {
      fetchProducts();
    }
  }, []);

  

  const fetchProducts = async () => {
    try {
        const response = await axios.get('http://localhost:8000/getRantedInventory?page=1&limit=100', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const products = response.data.data;
        const matchedProduct = products.find(product => product?._id === uid?.id);
        setFormData(matchedProduct);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};





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
      const [id, name2] = e.target.value.split('-');
      console.log("Selected ID:", id);
      console.log("Selected Name:", name);
      fetchSubDropdownOptions(id);
      setFormData({
        ...formData,
        [name]: name2
      });
    }
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
        const formattedData = {
            ...formData,
            endDate: formateDate(formData.endDate),
            startDate: formateDate(formData.startDate)
        };

        console.log(formattedData);
        

        if (uid?.id) {
            // Update product
            await axios.put(`http://localhost:8000/updateInventory/${uid?.id}`, formattedData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Product updated successfully!', {
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
            window.location.href = '/viewproduct'
        } else {
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
        }

        // Reset the form
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
        console.error('Error submitting data:', error);
    }
};



  console.log(formData);




  return (
    <Container maxWidth="sm">
      <Box className="container">
        <Typography variant="h4" gutterBottom className="titlee">
          {uid?.id ? "Update Data" : "Add data"}
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
              <MenuItem value="S">S</MenuItem>
              <MenuItem value="M">M</MenuItem>
              <MenuItem value="L">L</MenuItem>
              <MenuItem value="XXL">XXL</MenuItem>
              <MenuItem value="XXXL">XXXL</MenuItem>
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
                <MenuItem key={option?._id} value={`${option?._id}-${option?.name}`}>
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
            {uid?.id ? "Edit" : "Submit"}
          </Button>
        </form>
        <ToastContainer />
      </Box>
    </Container>

  );
};

export default Product;
