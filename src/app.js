const express = require('express');
const dotenv = require('dotenv');
const weatherRoutes = require('./routes/weatherRoutes');
const rateLimiter = require('./utils/rateLimiter');
const path = require('path');

dotenv.config();

const app = express();

app.use(express.json());
app.use(rateLimiter);

app.use('/api/weather', weatherRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} else {
    module.exports = app;
}
