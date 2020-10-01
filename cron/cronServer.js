const express = require('express');
const dotenv = require('dotenv');
const http = require('http');

const connectDB = require('../config/cronDB');
const fetchDailyExchangeRates = require('./fetchDailyExchangeRates');
const cleanupEmptyTrips = require('./cleanupEmptyTrips');


dotenv.config({ path: '../config/config.env' });

const httpPort = 3281;

const app = express();
const httpServer = http.createServer(app);

connectDB();

app.use(express.json());
///////////////
// CRON JOBS //
///////////////

// Get daily exchange rates from the API at 01:00
fetchDailyExchangeRates;
// Delets trips that don't have user_id reference to them
cleanupEmptyTrips;

httpServer.listen(httpPort, () => {
	console.log('Cron server is alive on port: ',httpPort, 'runnign as: ', process.env.NODE_ENV);
});