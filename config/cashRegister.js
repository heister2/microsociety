var User = require('../app/models/user');
var Account = require('../app/models/account');
var Transaction = require('../app/models/transaction');
var Inventory = require('../app/models/inventory');
var Purchase = require('../app/models/purchase');
var Business = require('../app/models/business');

module.exports.getBusiness = function(req, res, next) {
  Business.findOne({'idNum': req.user.employerID}, function(err, business) {
    Inventory.find({'business': req.user.employerID}, function(err, allInventory) {
      res.render('cashRegister.jade', {
        user: req.user,
        inventory: allInventory,
        business: business,
        flash: req.flash()
      });
    });
  });
}

module.exports.makeTransactions = function(req, res, next) {
  var items = req.body.itemsList;
  var itemsArray = items.split(',');
  var succesfulOrNot = true;

  User.findOne({'idNum': req.body.customerID}, function(err, user) {
    if (user && (user.account.balance > 0)) {
      // Create purchases
      Inventory.find({'business': req.user.employerID}, function(err, products) {
        // Create a transaction
        var newTransaction = new Transaction();
        newTransaction.timestamp = new Date();
        newTransaction.customerID = req.body.customerID;
        newTransaction.busID = req.user.employerID;
        newTransaction.verified = req.body.verified;

        console.log(products);

        for (var x = 0; x < products.length; x++) {
          
          for (var i = 0; i < itemsArray.length; i++) {
          
            if (i === 0 || (i % 2 === 0)) {
              
              var quantity = Number(itemsArray[i + 1])
              if (products[x]['item'] === itemsArray[i]) {
                var newPurchase = new Purchase();
                newPurchase.item = products[x]['item'];
                newPurchase.price = products[x]['price'];
                newPurchase.quantity = quantity;
                var total = products[x]['price'] * quantity;
                newPurchase.total = total;
                newPurchase.save(function(err) {
                  if (err) {
                    console.log('Purchase Error ' + err);
                    succesfulOrNot = false;
                  } 
                })
                
                products[x]['quantity'] = products[x]['quantity'] - quantity;
                newTransaction.purchases.push(newPurchase);

                products[x].save(function(err) {
                  if (err) {
                    console.log(err);
                    succesfulOrNot = false;
                  } 
                })
              }
            }
          }
        }

        newTransaction.save(function(err) {
          if (err) {
            console.log('Error ' + err);
            succesfulOrNot = false;
          }
        });
      });

      Business.update({'idNum': req.user.employerID}, {'$inc': {
        'account.balance': req.body.total
      }}, function(err) {
        if (err) {
          console.log('No business found. ' + err);
          succesfulOrNot = false;
        }
      });
      
      user.save(function(err) {
        if (err) {
          console.log(err);
          succesfulOrNot = false;
        }
      })

      User.update({'idNum': req.body.customerID}, {'$inc': {
        'account.balance': -req.body.total
      }}, function(err, user) {
        if (err) {
          console.log(err);
          succesfulOrNot = false;
        }
      }); 

      if (succesfulOrNot) {
        console.log('Success!');
        req.flash('success', 'Successful Transaction!');
        res.redirect('/cashRegister');
      } else {
        console.log('Failure!');
        req.flash('failure', 'Something went wrong!');
        res.redirect('/cashRegister');
      }

    } else {
      if (err) {
        console.log('Error ' + err);
      } else {
        console.log(user.account.balance);
      }
      req.flash('failure', 'Error! Customer ID or Customer Balance Issue');
      res.redirect('/cashRegister');
    }
  });
}

// module.exports.makeTransactions = function(req, res, next) {
//   var items = req.body.itemsList;
//   var itemsArray = items.split(',');
//   var succesfulOrNot = false;

//   User.findOne({'idNum': req.body.customerID}, function(err, user) {
//     if (user) {
//       var newTransaction = new Transaction();
//       newTransaction.timestamp = new Date();
//       newTransaction.customerID = req.body.customerID;
//       newTransaction.busID = req.user.employerID;
//       newTransaction.verified = req.body.verified;
      
//       newTransaction.save(function(err) {
//         if (err)
//           console.log(err);
//       });

//       for (var i = 0; i < itemsArray.length; i++) {
//         if (i === 0 || (i % 2 === 0)) {
//           var quantity = Number(itemsArray[i + 1]);
//           Inventory.findOne({'item': itemsArray[i]}, function(err, thing) {
//             if (err)
//               console.log('problem ' + err);
//             if (thing) {
//               var newPurchase = new Purchase();
//               newPurchase.item = thing.item;
//               newPurchase.price = thing.price;
//               newPurchase.quantity = quantity;
//               var total = thing.price * quantity;
//               newPurchase.total = total;
//               newPurchase.save(function(err) {
//                 if (err)
//                   console.log(err);
//               });

//               Transaction.update({_id: newTransaction._id}, {'$push': {
//                 'purchases': newPurchase
//               }}, function(err, transaction) {
//                 if (err)
//                   console.log(err);

//                 if (!transaction) {
//                   console.log('No transaction found.')
//                   succesfulOrNot = false;
//                 } else {
//                   succesfulOrNot = true;
//                 }
//               });
//             }
//           });

//           Inventory.where('quantity').gte(0).update({'business': req.user.employerID, 'item': itemsArray[i]}, {'$inc': {
//             'quantity': -quantity
//           }}, function(err, item) {
//             if (err) {
//               console.log('Error ' + err);
//               succesfulOrNot = false;
//             }

//             if (!item) {
//               console.log('No item found.')
//               succesfulOrNot = false;
//             } else {
//               succesfulOrNot = true;
//             }
//           });
//         } 
//       }

//       Business.update({'idNum': req.user.employerID}, {'$inc': {
//         'account.balance': req.body.total
//       }}, function(err, business) {
//         if (err)
//           console.log(err);
        
//         if (!business) {
//           console.log('No business found.');
//           succesfulOrNot = false;
//         } else {
//           succesfulOrNot = true;
//         }
//       });
      
//       User.update({'idNum': req.body.customerID}, {'$inc': {
//         'account.balance': -req.body.total
//       }}, function(err, user) {
//         if (err)
//           console.log(err);

//         if (!user) {
//           console.log('No User Found.');
//           succesfulOrNot = false;
//         } else {
//           succesfulOrNot = true;
//         }
//       }); 
      
//       if (!succesfulOrNot) {
//         req.flash('failure', 'Error! Transaction was unsuccessful.');
//         res.redirect('/cashRegister');
//       }
//     } else {
//       console.log('Outside Error');
//       req.flash('failure', 'Error! Transaction was unsuccessful.');
//       res.redirect('/cashRegister');
//     }
//   });
// }