const cron = require('node-cron');
const middleware = require('../middleware/cron');

console.log('CronJob initialized');

cron.schedule('0 1 * * *', async () => {
  try {
    middleware.getRates();
    middleware.deleteTrips();
    const date = new Date();
    const formattedDate = date.toLocaleTimeString();
    console.log(`${formattedDate} - Cron is running: getRates/deleteTrips !`);
  } catch (err) {
    console.log(err);
  }
});
  