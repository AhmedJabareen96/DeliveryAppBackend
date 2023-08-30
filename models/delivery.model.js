const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliverySchema = new Schema({
  clientId: {
    type: Number,
    required: true
  },
  storesAndItems: {
    type: [{
      storeId: {
        type: Number,
        required: true
      },
      itemIds: {
        type: [Number],
        required: true
      }
    }],
    required: true,
    default: []
  },
  deliverId: {
    type: Schema.Types.ObjectId,
    ref: 'Deliver'
  }
}, {
  timestamps: true,
});

const Delivery = mongoose.model('Delivery', deliverySchema);
module.exports = Delivery;
