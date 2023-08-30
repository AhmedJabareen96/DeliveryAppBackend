const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const managerSchema = new Schema({
  password: {
    type: String,
    required: true
  },

  address: {
    type: String,
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
  activityLog: {
    type: [String],
    default: []
  },
  hiringDate: {
    type: Date,
  }
}, {
  timestamps: true,
});

const Manager = mongoose.model('Manager', managerSchema);
module.exports = Manager;
