import React, { useEffect, useState } from 'react';
import './Dashbord.css';
import axios from 'axios';
import Loader from './Loader';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Container, Typography, Box, TextField } from '@mui/material';

function Todaysbooking() {
    const [dashboardData, setDashboardData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const base_url = "https://option-backend.onrender.com"

    useEffect(() => {
        const token = localStorage?.getItem('token');
        if (!token) {
            window.location.href = '/login';
        } else {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    let response = await axios.get(`${base_url}/getRantedInventory`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setDashboardData(response.data.data);
                } catch (error) {
                    console.error('Error fetching dashboard data', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, []);

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear());
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        if (dashboardData.length > 0) {
            const today = formatDate(new Date());
            const filtered = dashboardData.filter(item => {
                const itemStartDate = formatDate(item.startDate);
                return itemStartDate === today;
            });
            setFilteredData(filtered);
            setFilteredProducts(filtered);
        }
    }, [dashboardData]);



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

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = filteredData.filter(product =>
            product?.code?.toLowerCase().includes(query) ||
            product?.mainDropdown?.toLowerCase().includes(query)
        );
        setFilteredProducts(filtered);
    };


    return (
        <Container maxWidth="lg">
            {loading && <Loader />}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Today's Booking
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts?.map((product) => (
                                <TableRow key={product?.id}>
                                    <TableCell>{product?.code}</TableCell>
                                    <TableCell>{product?.color}</TableCell>
                                    <TableCell>{formatDate(product?.startDate)}</TableCell>
                                    <TableCell>{formatDate(product?.endDate)}</TableCell>
                                    <TableCell>{product?.size}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color={getStatusColor(product?.status)}>
                                            {product?.status}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{product?.time}</TableCell>
                                    <TableCell>{product?.mainDropdown}</TableCell>
                                    <TableCell>{product?.subName}</TableCell>   
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}

export default Todaysbooking;
