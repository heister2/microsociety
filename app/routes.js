var User = require('../app/models/user')
var Transaction = require('../app/models/transaction');
var Inventory = require('../app/models/inventory');
var Purchase = require('../app/models/purchase');

var ConnectRoles = require('connect-roles');

var users = require('../config/user');
var businesses = require('../config/business');
var cashRegister = require('../config/cashRegister');

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    res.render('index.jade');
  });

  app.get('/login', function(req, res) {
    res.render('login.jade', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/signup', user.can('access admin page'), function(req, res) {
    res.render('signup.jade', { message: req.flash('signupMessage') });
  });

  app.post('/signup', user.can('access admin page'), users.signUp);

  app.get('/business', user.can('access admin page'), function(req, res) {
    res.render('register.jade', {
      user: req.user
    });
  });

  app.post('/business', user.can('access admin page'), businesses.registerBusiness);

  app.get('/dashboard', isLoggedIn, users.getInfo);

  app.get('/users', user.can('access admin page'), users.findAllUsers);

  app.get('/users/:id', user.can('access admin page'), users.findUser);

  app.get('/businesses/:id', businesses.findBusiness);

  app.get('/edit/:id', user.can('access admin page'), users.findUserToEdit);

  app.post('/edit/:id', user.can('access admin page'), users.editUser);

  app.get('/editBus/:id', user.can('access admin page'), businesses.findBusinessToEdit);

  app.post('/editBus/:id', user.can('access admin page'), businesses.editBusiness);

  app.get('/cashRegister', user.can('access cash register'), cashRegister.getBusiness);

  app.post('/cashRegister', user.can('access cash register'), cashRegister.makeTransactions);

  app.get('/inventory', user.can('access inventory'), businesses.getInventory);

  app.post('/inventory', user.can('access inventory'), businesses.addItems);

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

};

var user = new ConnectRoles({
  failureHandler: function (req, res, action) {
    var accept = req.headers.accept || '';
    res.status(403);
    if (~accept.indexOf('html')) {
      res.render('access-denied', {action: action});
    } else {
      res.send('Access Denied - You don\'t have permission to: ' + action);
    }
  }
});

user.use(function (req, action) {
  if (!req.isAuthenticated()) return action === 'access home page';
});

user.use('access private page', function (req) {
  if (req.user.role === 'Teacher' || 'Student' || 'Admin') {
    return true;
  }
});

user.use('access cash register', function (req) {
  if (req.user.role === "Student" && req.user.job === "Cashier") {
    return true;
  }
});

user.use('access inventory', function (req) {
  if (req.user.role === "Student" && req.user.job === "Manager") {
    return true;
  }
});

user.use('access teacher page', function (req) {
  if (req.user.role === 'Teacher' || 'Admin') {
    return true;
  }
});

// user.use('access cash register', function (req) {
//   if (req.user.entity === "Business") {
//     return true;
//   }
// })

user.use(function (req) {
  if (req.user.role === 'Admin') {
    return true;
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
};
