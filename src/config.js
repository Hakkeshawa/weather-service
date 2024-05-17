module.exports = {
    YR_API_URL: 'https://api.met.no/weatherapi/locationforecast/2.0/compact',
    OW_API_KEY: 'f056679aa7142c034d6fdd6732cadcf1',
    PORT: process.env.PORT || 3000,
    RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 минут
    RATE_LIMIT_MAX: 100 // Макс 100 запросов за 15 минут
};
