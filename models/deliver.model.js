const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deliverSchema = new Schema({
  currentLocation: {
    lat: {
      type: String,
      
    },
    lng: {
      type: String,
      
    }
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
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
  drivingLicense: {
    type: String,
    required: true
  },
  carType: {
    type: String,
    required: true
  },
  carNumber: {
    type: String,
    required: true
  },
  deliveriesLog: {
    type: [Number],
    
    default: []
  },
  subscriptionDate: {
    type: String,
    
  },
  deliveries: [{
    type: Schema.Types.ObjectId,
    ref: 'Delivery'
  }]
}, {
  timestamps: true,
});

const Deliver = mongoose.model('Deliver', deliverSchema);
module.exports = Deliver;
