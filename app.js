const express = require('express');

const app = express();

const PORT = process.env.PORT || 60;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Test Endpoint
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
