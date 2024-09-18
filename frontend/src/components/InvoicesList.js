import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, Table, TableBody,TableContainer, TableCell, TableHead, TableRow, Paper, TextField,Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css'; 
import Loader from './Loader';

const InvoicesList = () => {
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const base_url = "https://option-backend.onrender.com"; // Replace with your backend URL

  const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
    }
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Debounced search term to limit API calls on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch invoices with pagination and search term
  const fetchInvoices = async (page, search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}/InvoiceData`, {
        params: {
          page,
          limit: 25,
          search
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoading(false);
      setInvoices(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Error fetching invoices');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(page, debouncedSearch);
  }, [page, debouncedSearch]);

  const handleDownload = async (invoiceId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}/generateInvoice/${invoiceId}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Invoice_${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setLoading(false);
      toast.success('Invoice downloaded successfully',);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Error downloading invoice');
      setLoading(false);
    }
  };

  // Handle delete button click
  const handleDelete = async (invoiceId) => {
    try {
      setLoading(true);
      await axios.delete(`${base_url}/invoiceDelete/${invoiceId}`, {});
      // Refresh the invoice list after deletion
      fetchInvoices(page, debouncedSearch);
      setLoading(false);
      toast.success('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Error deleting invoice');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      {loading && <Loader />}
      <Box sx={{ mt: 4 }}>
      <ToastContainer autoClose={1000}/>
        {/* Search input */}
        <TextField
          label="Search by Customer Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
              <TableCell>Invoice Date</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice._id}>
                <TableCell>{formatDate(invoice.date)}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>₹{invoice.total.toFixed(2)}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDownload(invoice._id)}
                    style={{ marginRight: '10px' }}
                  >
                    Download
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(invoice._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>Page {page} of {totalPages}</span>
        <Button
          variant="contained"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
      </Box>
    </Container>
  );
};

export default InvoicesList;
