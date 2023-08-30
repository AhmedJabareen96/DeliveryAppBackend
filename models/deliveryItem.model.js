const mongoose = require('mongoose');

const DeliveryItemSchema = new mongoose.Schema({
  items: {
    type: String,
    required: true,
  },
});

const DeliveryItem = mongoose.model('DeliveryItem', DeliveryItemSchema);

module.exports = DeliveryItem;
