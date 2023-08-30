const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 3
  },
  message: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
});

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);
module.exports = ForgotPassword;
