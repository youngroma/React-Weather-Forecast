import axios from 'axios';
console.log(import.meta.env);

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const fetchWeatherForCity = async (city, unit = 'metric') => {
    try {
        const response = await axios.get(`${BASE_URL}?q=${city}&units=${unit}&appid=${API_KEY}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
};

