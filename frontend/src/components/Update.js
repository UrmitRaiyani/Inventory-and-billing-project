import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, MenuItem } from '@mui/material';

const Update = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        code: '',
        color: '',
        endDate: '',
        size: '',
        startDate: '',
        time: '',
        dropdown: '',
        subDropdown: ''
    });
    const [loading, setLoading] = useState(false);
    const token = localStorage?.getItem('token');

    useEffect(() => {
        fetchProduct();
    }, []);

    
    
    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8000/getRantedInventory/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFormData(response.data);
            
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8000/updateInventory/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/');
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Update Product
                </Typography>
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : (
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
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
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
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Time"
                            name="time"
                            type="time"
                            value={formData.time}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Dropdown"
                            name="dropdown"
                            value={formData.dropdown}
                            onChange={handleChange}
                            select
                            fullWidth
                            margin="normal"
                        >
                            <MenuItem value="option1">Option 1</MenuItem>
                            <MenuItem value="option2">Option 2</MenuItem>
                        </TextField>
                        <TextField
                            label="Sub Dropdown"
                            name="subDropdown"
                            value={formData.subDropdown}
                            onChange={handleChange}
                            select
                            fullWidth
                            margin="normal"
                        >
                            <MenuItem value="subOption1">Sub Option 1</MenuItem>
                            <MenuItem value="subOption2">Sub Option 2</MenuItem>
                        </TextField>
                        <Button type="submit" variant="contained" color="primary">
                            Save
                        </Button>
                    </form>
                )}
            </Box>
        </Container>
    );
};

export default Update;
