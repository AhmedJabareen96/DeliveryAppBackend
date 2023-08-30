const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  workingHours: {
    type: String,
  },
  lat: {
    type: String,
    required: true
  },
  lng: {
    type: String,
    required: true
  },

  items: [{ type: Number }]
}, {
  timestamps: true,
});

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;
