require('dotenv').config();
const express = require('express');
const weatherService = require('./services/weather-service');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: 'City is required' });

    try {
        const data = await weatherService.getWeather(city);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
