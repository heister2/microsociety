var mongoose = require('mongoose');

var transactionSchema = mongoose.Schema({
  timestamp: { type: Date, required: true },
  customerID: { type: Number, required: true },
  busID: { type: Number, required: true },
  verified: { type: Boolean, required: true },
  purchases: { type: Array }
})

module.exports = mongoose.model('Transaction', transactionSchema);