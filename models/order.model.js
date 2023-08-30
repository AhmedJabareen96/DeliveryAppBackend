const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const orderSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  items: {
    type: String,
    required: true,
  },
  deliverId: {
    type: Schema.Types.ObjectId,
    ref: 'Deliver',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
