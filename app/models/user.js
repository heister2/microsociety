var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  idNum: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String },
  name: { 
    first: { type: String }, 
    last: { type: String } 
  },
  employerID: { type: Number },
  job: { type: String },
  busIDs: { type: Array },
  grade: { type: Number },
  account: { type: Object }
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);