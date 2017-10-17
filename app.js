"use strict";

var express		  = require('express');
var app			    = express();
var mongo 	 	  = require('mongodb').MongoClient;
var passport 	  = require('passport');
var flash    	  = require('connect-flash');
var morgan      = require('morgan');
var cookies 	  = require('cookie-parser');
var formidable 	= require('express-formidable');
var validator	  = require('express-validator');
var session     = require('express-session');
var io 			    = require('socket.io')();

var port 		    = process.env.PORT || 8080;

require('./app/passport')(passport);

app.use(express.static('public'));
app.use(express.static('src/views'));
app.use(formidable())
app.use(morgan('dev'));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 3600000/2 } // (3600000 = 1 hour)
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash()); 
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(validator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.set('views', './src/views');
app.set('view engine', 'ejs');
app.set('mongoUrl','mongodb://localhost:27017/netcode');

io.listen(app.listen(port,"0.0.0.0",function (err) {
	if(err)
		console.log(err);
	app.port = port;
}));

require('./app/routes.js')(app, io, mongo, passport);