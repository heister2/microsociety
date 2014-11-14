var mongoose = require('mongoose');

var accountSchema = mongoose.Schema({
  balance: { type: Number, required: true },
  type: { type: String, required: true }
});

module.exports = mongoose.model('Account', accountSchema);