var mongoose = require('mongoose');

var purchaseSchema = mongoose.Schema({
  item: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  cashier: { type: Number}
});

module.exports = mongoose.model('Purchase', purchaseSchema);
