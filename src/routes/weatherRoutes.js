const express = require('express');
const { getWeatherByCity, getWeatherByCoords } = require('../controllers/weatherController');

const router = express.Router();

router.get('/city', getWeatherByCity);
router.get('/coords', getWeatherByCoords);

module.exports = router;
