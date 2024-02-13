const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});