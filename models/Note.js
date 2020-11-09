const mongoose = require('mongoose');

const noteSchema = new mongoose.schema({
  title: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  }
})

const Note = mongoose.model('Note', noteSchema);

module.exports = Note