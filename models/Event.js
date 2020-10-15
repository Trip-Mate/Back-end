const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  date: {
    type: Date,
    required: true,
  },
  eventType: {
    type: String,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  isMustSee: {
    type: Boolean,
  },
  scheduledFor: {
    type: Date,
  },
  country: {
    type: String,
  },
  place: {
    type: String,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
  },
  website: {
    type: String,
  },
  phone: {
    type: String
  },
  contact: {
    type: String,
  },
  amount: {
    type: Number,
  },
  currency: {
    type: String,
  },
  attachments: {
    type: Array,
  },
  photos: {
    type: Array,
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event