const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());


const PORT = process.env.PORT || 90;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Middleware to log request details
app.use((req, res, next) => {
    console.log('URL:', req.url);
    next();
});


// Test Endpoint
app.get('/api-user', (req, res) => {
    res.send('user service');
});
