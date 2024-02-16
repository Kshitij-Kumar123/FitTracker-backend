const express = require('express');

const app = express();

const PORT = process.env.PORT || 70;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Middleware to log request details
app.use((req, res, next) => {
    console.log('URL:', req.url);
    next();
});


// Test Endpoint
app.get('/api/', (req, res) => {
    res.send('Hello, World!');
});
