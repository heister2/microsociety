var Business = require('../app/models/business');
var Account = require('../app/models/account');
var Inventory = require('../app/models/inventory');
var Transaction = require('../app/models/transaction');

var generator = new IDGenerator();

module.exports.registerBusiness = function(req, res, next) {
  var newBusiness = new Business();
  var newAccount = new Account();

  newBusiness.password = newBusiness.generateHash(req.body.password);
  newBusiness.idNum = generator.generate(3);
  newBusiness.bus_name = req.body.bus_name;

  newAccount.type = 'Business';
  newAccount.balance = 50;
  
  newAccount.save(function(err) {
    if (err)
      console.log('There was an error creating an account: ' + err);
  });

  newBusiness.account = newAccount;

  newBusiness.save(function(err) {
    if (err)
      console.log('There was a error creating a user: ' + err);
  });

  if (newBusiness && newAccount) {
    res.redirect('/dashboard');
  }
}

module.exports.findBusiness = function(req, res, next) {
  Business.findById(req.params.id, function(err, business) {
    Inventory.find({'business': business.idNum}, function(err, inventory) {
      Transaction.find({'busID': business.idNum}, function(err, transactions) {
        res.render('business.jade', {
          user: req.user,
          business: business,
          inventory: inventory,
          transactions: transactions
        });
      });
    });
  });
}

module.exports.findBusinessToEdit = function(req, res, next) {
  Business.findById(req.params.id, function(err, business) {
    res.render('editBusiness.jade', {
      user: req.user,
      business: business
    });
  });
}

module.exports.editBusiness = function(req, res, next) {
  var facilitatorInfo = req.body.facilitators.split(' ');

  Business.update({_id: req.params.id}, {'$set': {
    'bus_name': req.body.bus_name,   
    'facilitatorIDs': Number(facilitatorInfo[2]),
  }}, function(err) {
    if (err)
      console.log('There was an error: ' + err);
  });

  if (req.body.password !== '') {
    Business.findById({_id: req.params.id}, function(err, business) {
      business.password = business.generateHash(req.body.password);
      business.save(function(err) {
        if (err)
          console.log(err);
        res.redirect('/users');
      });
    });
  } else {
    res.redirect('/users');
  }
}

module.exports.getInventory = function(req, res, next) {
  Business.findOne({'idNum': req.user.employerID}, function(err, business) {
    Inventory.find({'business': req.user.employerID}, function(err, allInventory) {
      if (allInventory) {
        res.render('inventory.jade', {
          user: req.user,
          business: business,
          inventory: allInventory
        });
      } else {
        res.render('inventory.jade', {
          user: req.user,
          business: business,
        });
      }
    })
  })
}

module.exports.addItems = function(req, res, next) {
  newInventory = new Inventory();
  newInventory.business = req.user.employerID;
  newInventory.item = req.body.item;
  newInventory.quantity = req.body.quantity;
  newInventory.cost = req.body.cost;
  newInventory.price = req.body.price;
  newInventory.save(function(err) {
    if (err)
      console.log(err);
    res.redirect('/inventory');
  });
}

function IDGenerator() { 
  this.timestamp = +new Date;

  var _getRandomInt = function( min, max ) {
  return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
  }

  this.generate = function(length) {
   var ts = this.timestamp.toString();
   var parts = ts.split( "" ).reverse();
   var id = "";
   
   for( var i = 0; i < length; ++i ) {
    var index = _getRandomInt( 0, parts.length - 1 );
    id += parts[index];  
   }
   
   return id;
  }
}