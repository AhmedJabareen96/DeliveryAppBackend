const mongoose = require('mongoose');


const graphSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  distances: {
    type: Map,
    of: Number,
  },
});
const Graph = mongoose.model('Graph', graphSchema);

module.exports = Graph;
