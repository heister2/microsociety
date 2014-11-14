var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var businessSchema = mongoose.Schema({
  idNum: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  bus_name: { type: String },
  facilitatorIDs: { type: Array },
  account: { type: Object }
});

businessSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

businessSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Business', businessSchema);