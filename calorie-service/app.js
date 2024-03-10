const express = require('express');
const cors = require('cors');
const app = express();
const routes = require("./business_logic/routes")
const { validateAccessToken, checkRequiredPermissions } = require('./middleware/auth0');
const fs = require('fs');

// Path to the mounted secrets directory
const secretsDirectory = '/mnt/secrets-store/';

// Function to read a secret file
function readSecret(secretName) {
    try {
        const secretFilePath = `${secretsDirectory}${secretName}`;
        const secretValue = fs.readFileSync(secretFilePath, 'utf-8');
        return secretValue.trim(); // Trim to remove whitespace
    } catch (error) {
        console.error('Error reading secret:', error);
        throw error;
    }
}


app.use(cors());
app.use(express.json())

const { MongoClient } = require('mongodb');


// Connection URL
const mongoDBurl = readSecret("mongodburl");

// Create a new MongoClient
const client = new MongoClient(mongoDBurl);


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
// app.use('/api-calorie', validateAccessToken, checkRequiredPermissions(['read:food_tracking_info']), routes)
const myDB = client.db("WinterProjectDB");

app.get('/', async (req, res) => {
    try {
        const myColl = myDB.collection("User-Collection");
        const doc = { userId: "1", name: "Neapolitan pizza", shape: "round" };
        const result = await myColl.insertOne(doc);
        console.log(
           `A document was inserted with the _id: ${result.insertedId}`,
        );        
    } catch (err) {
        console.log(err)
    }
    res.send('calorie service hello');
});