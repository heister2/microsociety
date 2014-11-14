var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var ConnectRoles = require('connect-roles');
var bcrypt = require('bcrypt-nodejs');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
app.locals.moment = require('moment');

//var configDB = require('./config/database.js');
mongoose.connect(process.env.db);
//mongoose.connect(configDB.url)

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.set('view engine', 'jade');

app.use(session({ secret: 'ilovemicrosociety' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, '/public')));

require('./app/routes.js')(app, passport);

app.listen(port);
console.log('The magic happens on port ' + port);