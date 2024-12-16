import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, IconButton } from '@mui/material';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import Layout from './Layout';
import { handleCitySelect } from './Cities';
import { Star, StarBorder } from '@mui/icons-material';



const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

const formatDate = (timestamp) => {
    return new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
    }).format(new Date(timestamp * 1000));
};

const getDayLabel = (timestamp, isToday) => {
    const formattedDate = formatDate(timestamp);
    return isToday ? 'Today' : formattedDate;
};


const WeatherDetails = () => {
    const navigate = useNavigate();
    const { name } = useParams();
    const [weatherData, setWeatherData] = useState(null);
    const [tempUnit, setTempUnit] = useState('C');
    const [selectedDay, setSelectedDay] = useState(null); // Status for selected day
    const [favorites, setFavorites] = useState([]);


    const handleCitySelection = (city, data) => {
        handleCitySelect(city, data, navigate);
    };

    useEffect(() => {
        const storedData = localStorage.getItem('weatherData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.city === name) {
                setWeatherData(parsedData.data);

                const today = new Date().toISOString().split('T')[0];
                setSelectedDay(today); // Set as selected day

                const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
                setFavorites(storedFavorites);
            }
        }
    }, [name]);

    const toggleFavorite = () => {
        let updatedFavorites;

        if (favorites.includes(name)) {
            updatedFavorites = favorites.filter((city) => city !== name); // Remove from favorites
        } else {
            updatedFavorites = [...favorites, name]; // Add to favorites
        }

        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    if (!weatherData) {
        return <Typography variant="h6">No weather data available</Typography>;
    }

    const list = weatherData.list || [];

    const groupByDay = () => {
        const grouped = [];
        list.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toISOString().split('T')[0];
            if (!grouped[day]) {
                grouped[day] = [];
            }
            grouped[day].push(forecast);
        });
        return grouped;
    };

    const convertTemperature = (temp) => {
        switch (tempUnit) {
            case 'F':
                return Math.round((temp * 9) / 5 + 32);
            case 'K':
                return Math.round(temp + 273.15);
            default:
                return Math.round(temp); // Default C
        }
    };

    const handleUnitChange = () => {
        if (tempUnit === 'C') {
            setTempUnit('F');
        } else if (tempUnit === 'F') {
            setTempUnit('K');
        } else {
            setTempUnit('C');
        }
    };

    const groupedData = groupByDay();
    const days = Object.keys(groupedData);

    const handleDaySelect = (day) => {
        setSelectedDay(day);
    };



    const renderDayInfo = (dailyForecast) => {
        const columnsPerRow = Math.ceil(dailyForecast.length / 2); // Вычисляем количество колонок в каждой строке

        return (
            <Box sx={{ border: '1px solid #ddd', padding: 2, borderRadius: 2 }}>
                <Grid container spacing={2}>
                    {dailyForecast.map((forecast, idx) => {
                        const iconCode = forecast.weather[0]?.icon;
                        const iconUrl = getWeatherIcon(iconCode);
                        const precipitation = forecast.rain?.['3h'] || forecast.snow?.['3h'] || 0;
                        const precipitationType = forecast.rain ? 'Rain' : forecast.snow ? 'Snow' : 'No precipitation';

                        return (
                            <Grid item xs={12 / columnsPerRow} key={idx}> {/* Разбиваем на N колонок */}
                                <Box
                                    sx={{
                                        padding: 2,
                                        borderRadius: 2,
                                        border: '1px solid #ddd',
                                        backgroundColor: '#e0f7fa',
                                    }}
                                >
                                    {/* Верхний блок */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            backgroundColor: '#e3f2fd',
                                            borderRadius: '10px',
                                            padding: 1,
                                            marginBottom: 2,
                                            fontFamily: '"Roboto", sans-serif',
                                        }}
                                    >
                                        <Typography
                                            variant="body1"
                                            sx={{ fontWeight: 'bold', marginBottom: 1 }}
                                        >
                                            {new Date(forecast.dt * 1000).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </Typography>
                                        {iconUrl && (
                                            <img
                                                src={iconUrl}
                                                alt={forecast.weather[0]?.description}
                                                style={{ width: '50px' }}
                                            />
                                        )}
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 'bold', color: '#0288d1' }}
                                        >
                                            {convertTemperature(forecast.main.temp)}°{tempUnit}
                                        </Typography>
                                    </Box>

                                    {/* Таблица дополнительной информации */}
                                    <Box>
                                        <table
                                            style={{
                                                width: '100%',
                                                borderCollapse: 'collapse',
                                                fontSize: '16px',
                                                fontFamily: '"Roboto", sans-serif',
                                            }}
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style={{
                                                            padding: '5px',
                                                            borderBottom: '1px solid #ddd',
                                                        }}
                                                    >
                                                        Weather:
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '5px',
                                                            borderBottom: '1px solid #ddd',
                                                        }}
                                                    >
                                                        {forecast.weather[0]?.description}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        style={{
                                                            padding: '5px',
                                                            borderBottom: '1px solid #ddd',
                                                        }}
                                                    >
                                                        Wind:
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '5px',
                                                            borderBottom: '1px solid #ddd',
                                                        }}
                                                    >
                                                        {forecast.wind.speed} m/s
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        style={{
                                                            padding: '5px',
                                                            borderBottom: '1px solid #ddd',
                                                        }}
                                                    >
                                                        Humidity:
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '5px',
                                                            borderBottom: '1px solid #ddd',
                                                        }}
                                                    >
                                                        {forecast.main.humidity}%
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ padding: '5px' }}>Precipitation:</td>
                                                    <td style={{ padding: '5px' }}>
                                                        {precipitationType} ({precipitation} mm)
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Box>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        );
    };

    return (
<Box sx={{ padding: 0 }}>
    <Layout onCitySelect={handleCitySelection} />

    <Typography
        variant="h5"
        gutterBottom
        sx={{
            textAlign: 'center',
            marginTop: 4,
            fontWeight: 'bold',
        }}
    >
        Weather for{' '}
        <span style={{ color: '#3f51b5', textTransform: 'capitalize' }}>
            {name ? name.toLowerCase() : 'Unknown City'}
        </span>
        <IconButton onClick={toggleFavorite} sx={{ fontSize: 40 }}>
                {favorites.includes(name) ? (
                    <Star sx={{ fontSize: 40, color: 'gold' }} />
                ) : (
                    <StarBorder sx={{ fontSize: 40 }} />
                )}
            </IconButton>

    </Typography>

    {/* Temperature switch button */}
    <Box sx={{ marginBottom: 2, textAlign: 'center' }}>
        <Button variant="contained" onClick={handleUnitChange}>
            Switch to ({tempUnit === 'C' ? 'F°' : tempUnit === 'F' ? 'K°' : 'C°'})
        </Button>
    </Box>

    {/* Karuzela */}
    <Swiper spaceBetween={20} slidesPerView={3} navigation loop modules={[Navigation]}>
        {days.map((day, index) => {
            const dailyForecast = groupedData[day];
            const isToday = new Date(dailyForecast[0].dt * 1000).toDateString() === new Date().toDateString();
            const dayLabel = getDayLabel(dailyForecast[0].dt, isToday);

            return (
                <SwiperSlide key={index}>
                    <Box
                        sx={{
                            border: '1px solid #ddd',
                            padding: 2,
                            borderRadius: 2,
                            cursor: 'pointer',
                            backgroundColor: selectedDay === day ? '#e0f7fa' : 'transparent',
                        }}
                        onClick={() => handleDaySelect(day)}
                    >
                        <Typography variant="h6">{dayLabel}</Typography>
                    </Box>
                </SwiperSlide>
                    );
                })}
            </Swiper>

            {selectedDay && renderDayInfo(groupedData[selectedDay])}
        </Box>
    );
};

export default WeatherDetails;
