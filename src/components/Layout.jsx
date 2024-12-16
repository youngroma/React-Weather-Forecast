import React, { useState } from 'react';
import { fetchWeatherForCity } from '../api/weather-api';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';

const Layout = ({ onCitySelect }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleHomeClick = () => {
        navigate('/');
    };



    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const data = await fetchWeatherForCity(searchQuery);
            onCitySelect(searchQuery, data); // pass the result to the parent component
        } catch (err) {
            setError('City not found. Try again.');
            console.error('Searching error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#3f51b5',
                color: 'white',
                width: '100%',
                boxSizing: 'border-box',
                borderBottom: '4px solid #ffffff',
            }}
        >
            {/* Home */}
            <Button
                onClick={handleHomeClick}
                sx={{
                    backgroundColor: '#ffffff',
                    color: '#3f51b5',
                    borderRadius: '20px',
                    padding: '10px 20px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                        backgroundColor: '#f0f0f0',
                    },
                }}
            >
                Home
            </Button>

            {/* Search */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '20px' }}>
                <TextField
                    variant="outlined"
                    placeholder="City name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        width: '100%',
                        maxWidth: '400px',
                        backgroundColor: '#ffffff',
                        borderRadius: '20px',
                        marginRight: '10px',
                        '& .MuiInputBase-root': {
                            padding: '5px',
                            fontSize: '16px',
                        },
                    }}
                />
                <Button
                    onClick={handleSearch}
                    variant="contained"
                    sx={{
                        backgroundColor: '#ffffff',
                        color: '#3f51b5',
                        borderRadius: '20px',
                        padding: '10px 20px',
                        '&:hover': {
                            backgroundColor: '#f0f0f0',
                        },
                    }}
                >
                    Search
                </Button>
            </Box>

            {/* Boot status or errors */}
            {loading && (
                <Box sx={{ marginLeft: '20px', color: 'white' }}>
                    <CircularProgress color="inherit" />
                </Box>
            )}
            {error && (
                <Typography variant="body2" sx={{ color: 'red', marginLeft: '20px' }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
};

export default Layout;
