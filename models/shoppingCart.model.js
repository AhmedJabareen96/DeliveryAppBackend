const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shoppingCartSchema = new Schema({
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
}, {
  timestamps: true,
});

const ShoppingCart = mongoose.model('ShoppingCart', shoppingCartSchema);
module.exports = ShoppingCart;
