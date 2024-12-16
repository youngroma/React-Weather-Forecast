import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Grid, Typography, Container } from '@mui/material';
import { fetchWeatherForCity } from '../api/weather-api';
import WeatherDetails from './WeatherDetails';
import Layout from './Layout';
import { Star } from '@mui/icons-material';
import { CITIES } from '../constants/cities';



export const handleCitySelect = (city, data, navigate) => {
    localStorage.setItem('weatherData', JSON.stringify({ city, data }));
    navigate(`/city/${city}`);
};

const CityList = () => {
    const navigate = useNavigate();  // navigation hook
    const [selectedCity, setSelectedCity] = useState(null); // Add state for selected city
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    const removeFromFavorites = (city) => {
        const updatedFavorites = favorites.filter((fav) => fav !== city);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };


    const handleCityClick = async (city) => {
        const data = await fetchWeatherForCity(city);
        localStorage.setItem('weatherData', JSON.stringify({ city, data }));
        navigate(`/city/${city}`);
    };

    return (
        <Container >
            <Layout onCitySelect={(city, data) => handleCitySelect(city, data, navigate)} />
            <Typography variant="h4" align="center" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
                Weather Forecast
            </Typography>
            <Box sx={{ marginBottom: 4, padding: 2 }}>
                <Grid container spacing={3} justifyContent="center">
                    {CITIES.map((city) => (
                        <Grid item key={city}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleCityClick(city)}
                                sx={{
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    borderRadius: '15px',
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                        backgroundColor: '#5c6bc0',
                                        boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.15)',
                                    },
                                }}
                            >
                                {city}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Box sx={{ padding: 2 }}>
            <Typography variant="h4" align="center" gutterBottom >
                <Star sx={{ fontSize: 20, color: 'gold', marginRight: 1 }} />
                Favorite Cities
                <Star sx={{ fontSize: 20, color: 'gold', marginLeft: 1 }} />
            </Typography>

            <Grid container spacing={2} justifyContent="center">
                {favorites.map((city) => (
                    <Grid item key={city}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                onClick={() => handleCityClick(city)}
                                sx={{ marginRight: 1 }}
                            >
                                {city}
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => removeFromFavorites(city)}
                            >
                                Remove
                            </Button>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>



        </Container>
    );
};



export default CityList;


