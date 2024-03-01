const express = require('express');
const cors = require('cors');
const app = express();
const routes = require("./business_logic/routes")
const { validateAccessToken, checkRequiredPermissions } = require('./middleware/auth0');

app.use(cors());
app.use(express.json())

const PORT = process.env.PORT || 50;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Middleware to log request details
app.use((req, res, next) => {
    console.log('URL:', req.url);
    next();
});

// Mapped Routes
app.use('/api-calorie', validateAccessToken, checkRequiredPermissions(['read:food_tracking_info']), routes)

app.get('/', (req, res) => {
    res.send('calorie service hello');
});