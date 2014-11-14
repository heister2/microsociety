var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');
var Account = require('../app/models/account');
var Business = require('../app/models/business');
var Inventory = require('../app/models/inventory');
var Transaction = require('../app/models/transaction');

var generator = new IDGenerator();

module.exports.signUp = function(req, res, next) {
  var newUser = new User();
  var newAccount = new Account();
  newUser.password = newUser.generateHash(req.body.password);
  
  newUser.idNum = generator.generate(6);
  newUser.name.first = req.body.firstName;
  newUser.name.last = req.body.lastName;
  newUser.role = req.body.role;
  if (req.body.role === "Student") {
    newUser.grade = req.body.grade;
  }
  newAccount.type = 'Personal';
  newAccount.balance = 50;
  
  newAccount.save(function(err) {
    if (err)
      console.log('There was an error creating an account: ' + err);
  });

  newUser.account = newAccount;

  newUser.save(function(err) {
    if (err)
      console.log('There was a error creating a user: ' + err);
  });

  if (newUser && newAccount) {
    res.redirect('/dashboard');
  }
}

module.exports.getInfo = function(req, res, next) {
  Transaction.find({'customerID': req.user.idNum}, function(err, cusTransactions) {
    Business.findOne({idNum: req.user.employerID}, function(err, business) {
      Inventory.find({'business': req.user.employerID}, function(err, allInventory) {
        Transaction.find({'busID': req.user.employerID}, function(err, busTransactions) {
          res.render('dashboard.jade', {
            user: req.user,
            inventory: allInventory,
            business: business,
            transactions: busTransactions,
            cusTransactions: cusTransactions
          });
        });
      });
    });
  });
}

module.exports.findAllUsers = function(req, res, next) {
  User.find(function(err, users) {
    Business.find(function(err, businesses) {
      if (err)
        res.send(err);
      res.render('users.jade', {
        user: req.user,
        businesses: businesses,
        users: users
      })
    })
  })
}

module.exports.findUser = function(req, res, next) {
  console.log(req.user);
  User.findById(req.params.id, function(err, userToView) {
    Transaction.find({'customerID': userToView.idNum}, function(err, cusTransactions) {
      if (err)
        res.send(err);
      res.render('user.jade', {
        user: req.user,
        userToView: userToView,
        cusTransactions: cusTransactions
      });
    });
  });
}

module.exports.findUserToEdit = function(req, res, next) {
  User.find({ "role" : "Student"}, function(err, students) {
    User.find({ "role" : "Teacher"}, function(err, teachers) {
      User.findById(req.params.id, function(err, userToEdit) {
        res.render('edit.jade', {
          user: req.user,
          students: students,
          teachers: teachers,
          userToEdit: userToEdit
        });
      });
    })
  })
}

module.exports.editUser = function(req, res, next) {
  User.findOne({_id: req.params.id}, function(err, user) {
    user.name.first = req.body.firstName;
    user.name.last = req.body.lastName;
    if (user.role === "Student") {
      user.grade = req.body.grade;
      user.employerID = req.body.employerID;
      user.job = req.body.job;
    }

    if (req.body.password !== '') {
      user.password = user.generateHash(req.body.password);
    }

    user.save(function(err) {
      if (err) 
        console.log(err)
      res.redirect('/users');
    }); 
  });
}

module.exports.deleteUser = function(req, res, next) {

}

module.exports.findCashiersForBusiness = function(req, res, next) {
  var verified = false;
  User.findOne({'idNum': req.user.idNum}, function(err, business) {
    if (err)
      console.log('Error ' + err);
    for (var i = 0; i < business.cashiersIDs.length; i++) {
      console.log('yes');
      if (req.body.cashierID === business.cashiersIDs[i]) {
        console.log('true');
        verified = true;
      }
    }
  });
  if (verified) 
    res.redirect('/cashRegister');
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