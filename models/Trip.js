const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  user: [
    {
      id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      },
      isVerified: {
        type: Boolean,
        default: false
      },
      isOwner: {
        type: Boolean,
        required: true,
        default: false,
      }
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  title: {
    type: String,
    required: true,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  countries: [],
  baseCurrency: {
    type: String,
    required: true,
  },
  additionalCurrencies: {
    type: Array,
  },
  budget: {
    type: Number,
  },
  backgroundImage: {
    type: String,
  },
  duration: {
    type: Number,
    required: true,
  }
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
