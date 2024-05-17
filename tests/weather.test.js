const request = require('supertest');
const express = require('express');
const weatherRoutes = require('../src/routes/weatherRoutes');
const rateLimiter = require('../src/utils/rateLimiter');
const path = require('path');

let app;
let server;

beforeAll((done) => {
    app = express();
    app.use(express.json());
    app.use(rateLimiter);
    app.use('/api/weather', weatherRoutes);
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../src/views', 'index.html'));
    });

    server = app.listen(4000, () => {
        global.agent = request.agent(server);
        done();
    });
});

afterAll((done) => {
    server.close(done);
});

describe('Weather API', () => {
    it('should return weather data for Moscow by city name', async () => {
        const response = await global.agent.get('/api/weather/city?city=Moscow');
        console.log('Response:', response.status, response.body); // Логируем ответ
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('temperature');
    }, 10000);

    it('should return weather data for coordinates', async () => {
        const response = await global.agent.get('/api/weather/coords?lat=55.7558&lon=37.6176');
        console.log('Response:', response.status, response.body); // Логируем ответ
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('temperature');
    });

    it('should return 400 if city name is not provided', async () => {
        const response = await global.agent.get('/api/weather/city');
        expect(response.status).toBe(400);
    });

    it('should return 400 if coordinates are not provided', async () => {
        const response = await global.agent.get('/api/weather/coords');
        expect(response.status).toBe(400);
    });
});
