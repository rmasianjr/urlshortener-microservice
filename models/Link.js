const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema({
  original_url: {
    type: String,
    trim: true,
    required: true
  },
  short_url: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Link', linkSchema);
