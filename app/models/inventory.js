var mongoose = require('mongoose');

var inventorySchema = mongoose.Schema({
  business: { type: Number, required: true },
  item: { type: String, required: true },
  quantity: { type: Number, required: true },
  cost: { type: Number, required: true },
  price: { type: Number, required: true }
});

module.exports = mongoose.model('Inventory', inventorySchema);