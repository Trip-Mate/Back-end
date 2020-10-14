const mongoose = require('mongoose');

const ratesSchema = new mongoose.Schema({
  rates: Object,
  base: String,
  date: Date,
});

const Rates = mongoose.model('Rate', ratesSchema);

module.exports = Rates;
