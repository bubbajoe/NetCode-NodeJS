var express		 = require('express');
var app			 = express();
var mongoose 	 = require('mongoose');
var passport 	 = require('passport');
var flash    	 = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var port     	 = process.env.PORT || 8080;

require('./app/passport')(passport);

app.use(express.static('public'));
app.use(express.static('src/views'));
app.use(morgan('dev'));
app.use(session({ secret: 'secret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); 

app.set('views', './src/views');
app.set('view engine', 'ejs');


var io = require('socket.io').listen(app.listen(port,"0.0.0.0",function (err) {
	if(err)
		console.log(err);
	app.port = port;
}));

require('./app/routes.js')(app, io, passport);















