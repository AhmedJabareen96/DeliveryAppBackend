const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 3
  },
  password: {
    type: String,
    required: true
  },
  currentLocation: {
    lat: {
      type: String,
    },
    lng: {
      type: String,
    }
  },
  address: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  dateOfSubscription: {
    type: String,
    required: false
  },
  payingMethod: {
    type: String,
    required: true
  },
  deliveriesLog: {
    type: [Number],
    default: []
  },
  shoppingCart: {
    type: Schema.Types.ObjectId,
    ref: 'ShoppingCart'
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
