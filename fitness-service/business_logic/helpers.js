const fs = require("fs");
const { MongoClient } = require('mongodb');
require('dotenv').config();
const express = require('express');
const app = express();

const isLocal = app.get('env') === 'development' || app.get('env') === 'test';

// Read secrets mounted by Secrets CSI driver connected to AKV
function readSecret(secretName) {
    try {
        // Path to the mounted secrets directory
        const secretsDirectory = '/mnt/secrets-store/';
        const secretFilePath = `${secretsDirectory}${secretName}`;
        const secretValue = fs.readFileSync(secretFilePath, 'utf-8');
        return secretValue.trim(); // Trim to remove whitespace
    } catch (error) {
        console.error('Error reading secret:', error);
        throw error;
    }
}

async function connectToCluster() {
    try {
        console.log("isLocal: ", isLocal);
        const uri = isLocal ? process.env.MONGODBURL : readSecret("mongodburl");
        const mongoClient = new MongoClient(uri);
        console.log('Connecting to MongoDB Atlas cluster...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB Atlas!');
        return mongoClient;
    } catch (error) { 
        console.error('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }
}


module.exports = {
    connectToCluster,
    readSecret,
    isLocal
}