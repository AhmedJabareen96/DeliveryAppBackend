const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  price: {
    type: Number,
    required: true
  },
  count: {
    type: Number,
    
  },
  isInterest: {
    type: Boolean,
    
  },
  category: {
    type: String,
    required: true
  },

}, {
  timestamps: true,
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
