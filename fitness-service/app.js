const express = require('express');
const cors = require('cors');
const app = express();
const routes = require("./business_logic/routes")
const { validateAccessToken, checkRequiredPermissions } = require('./middleware/auth0');
const dotenv = require('dotenv');

app.use(cors());
app.use(express.json())


// Check if the server is running on localhost
if (process.env.ENV === "dev") {
  // Code specific to local development or test environment
  console.log('Running locally or in test environment');
  dotenv.config({ path: '.env.development' });
} else {
  // Code for production or other environments
  console.log('Not running locally');
  dotenv.config();
}

const PORT = process.env.PORT || 60;

app.listen(PORT, async () => {
    try {
        console.log(`Server is running on port ${PORT}`);
    } catch (err) {
        console.error(err)
    }
});


// Middleware to log request details
app.use((req, res, next) => {
    console.log('URL:', req.url);
    next();
});

// Mapped Routes
app.use('/api-fitness', validateAccessToken, checkRequiredPermissions(['read:food_tracking_info']), routes)
