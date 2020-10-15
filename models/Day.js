const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  events: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  date: {
    type: Date,
    required: true,
  },
  country: {
    type: String,
  },
  place: {
    type: String,
  },
  accommodation: {
    accommodationType: {
      type: String,
    },
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    notes: {
      type: String,
    },
    email: {
      type: String,
    },
    website: {
      type: String,
    },
    phone: {
      type: String,
    },
    contactName: {
      type: String,
    },
    cost: {
      type: Number,
    },
    currency: {
      type: String,
    }
  },
  attachments: {
    type: Array,
  },
  photos: {
    type: Array,
  },
});

const Day = mongoose.model('Day', daySchema);

module.exports = Day;