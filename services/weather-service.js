const axios = require('axios');
//const redisClient = require('../cache/redis-client');
const cache = new Map();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeather(city) {
    const cacheKey = city.toLowerCase();
    const cached = cache.get(cacheKey);

    // Check if cached and not expired (10 mins)
    if (cached && Date.now() - cached.timestamp < 600000) {
        console.log('Serving from in-memory cache');
        return cached.data;
    }

    // Fetch from OpenWeatherMap
    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);
        const weatherData = response.data;

        // Store in cache
        cache.set(cacheKey, {
            data: weatherData,
            timestamp: Date.now(),
        });

        return weatherData;
    } catch (error) {
        console.log('Weather API error: ', error.message);
        throw error;
    }
}

module.exports = {
    getWeather
};