const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  trips: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
    },
  ],
  // emailVerified: {
  // 	type: Boolean,
  // 	default: false,
  // },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
