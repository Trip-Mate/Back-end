const fetch = require('node-fetch');
const Trip = require('../models/Trip');
const Rates = require('../models/Rates');
const config = require('../config/app');

module.exports = {
  deleteTrips: async () => {
    await Trip.deleteMany({ user: { $exists: true, $size: 0 } });
  },

  getRates: async () => {
    const res = await fetch(
      `http://data.fixer.io/api/latest?access_key=${config.fixerKey}`
    );
    const resJSON = await res.json();
    const rates = new Rates(resJSON);
    await rates.save();
  },
};
