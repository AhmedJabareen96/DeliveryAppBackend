const mongoose = require('mongoose');
const { Schema } = mongoose;

const basketSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  items_obj: {
    type: Schema.Types.Mixed,
    required: true
  },
  user_location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  price: {
    type: Number,
    default: 0
  }
});

const Basket = mongoose.model('Basket', basketSchema);

module.exports = Basket;
