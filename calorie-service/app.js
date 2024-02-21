const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());


const PORT = process.env.PORT || 50;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Middleware to log request details
app.use((req, res, next) => {
    console.log('URL:', req.url);
    next();
});


// Test Endpoint
app.get('/', (req, res) => {
    res.send('Lerling');
});
