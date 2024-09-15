import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Container, Typography, Box, TextField } from '@mui/material';
import Loader from './Loader';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Viewproduct.css'

const Viewproduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const token = localStorage?.getItem('token')
    const base_url = "https://option-backend.onrender.com"

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${base_url}/getRantedInventory?page=1&limit=100`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProducts(response.data.data);
            setFilteredProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${base_url}/deleteInventory/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchProducts();
            toast.success('Product Delete successfully!', {
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
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleUpdate = (id) => {
        window.location.href = `/update/${id}`
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = products.filter(product =>
            product?.code?.toLowerCase().includes(query) ||
            product?.mainDropdown?.toLowerCase().includes(query)
        );
        setFilteredProducts(filtered);
    };

    
    

    const getStatusColor = (status) => {
        switch (status) {
          case 'pending':
            return 'warning';
          case 'active':
            return 'success';
          case 'expired':
            return 'error';
          default:
            return 'default';
        }
      };

    return (
        <Container maxWidth="lg">
            {loading && <Loader />}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Product List
                </Typography>
                <TextField
                    label="Search"
                    variant="outlined"
                    className='search'
                    fullWidth
                    margin="normal"
                    value={searchQuery}
                    onChange={handleSearch}
                    InputProps={{
                        style: {
                            backgroundColor: 'white',
                        }
                    }}
                />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Code</TableCell>
                                <TableCell>Color</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Sub Name</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product?.id}>
                                    <TableCell>{product?.code}</TableCell>
                                    <TableCell>{product?.color}</TableCell>
                                    <TableCell>{formatDateTime(product?.startDate)}</TableCell>
                                    <TableCell>{formatDateTime(product?.endDate)}</TableCell>
                                    <TableCell>{product?.size}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color={getStatusColor(product?.status)}>
                                            {product?.status}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{product?.time}</TableCell>
                                    <TableCell>{product?.mainDropdown}</TableCell>
                                    <TableCell>{product?.subName}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => handleUpdate(product?._id)} sx={{ mr: 1 }}>
                                            Update
                                        </Button>
                                        <Button variant="contained" color="error" onClick={() => handleDelete(product?._id)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <ToastContainer />
            </Box>
        </Container>
    );
};

export default Viewproduct;
