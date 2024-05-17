const axios = require('axios');
const { YR_API_URL, OW_API_KEY } = require('../config');

const getCoordsByCityName = async (city) => {
    const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
        params: {
            q: city,
            appid: OW_API_KEY
        }
    });

    if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat, lon };
    } else {
        throw new Error('City not found');
    }
};

const getWeatherByCity = async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        const { lat, lon } = await getCoordsByCityName(city);
        return getWeather(lat, lon, res);
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        res.status(500).json({ error: 'Error fetching coordinates' });
    }
};

const getWeatherByCoords = async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    return getWeather(lat, lon, res);
};

const getWeather = async (lat, lon, res) => {
    try {
        console.log('Fetching weather for coordinates:', lat, lon);
        const response = await axios.get(`${YR_API_URL}`, {
            params: { lat, lon },
            headers: { 
                'User-Agent': 'weather-service',
                'Accept': 'application/json' 
            }
        });

        const weatherData = response.data;
        console.log('Weather data fetched:', weatherData);

        const forecast = weatherData.properties.timeseries.find(f => new Date(f.time).getUTCHours() === 14);

        if (forecast) {
            res.json({
                time: forecast.time,
                temperature: forecast.data.instant.details.air_temperature
            });
        } else {
            res.status(404).json({ error: 'No forecast found for 14:00' });
        }
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Error fetching weather data' });
    }
};

module.exports = { getWeatherByCity, getWeatherByCoords };
