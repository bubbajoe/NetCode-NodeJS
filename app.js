var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

// configuration ===============================================================
//mongoose.connect('mongodb://localhost/myapp');

require('./app/passport')(passport); // pass passport for configuration

//Middlewares
app.use(express.static('public'));
app.use(express.static('src/views'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(session({ secret: 'secret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); 

app.set('views', './src/views');				//for templating engine
app.set('view engine', 'ejs');

require('./app/routes.js')(app, passport);

// Root
app.get('/', function (req,res) {
	res.render('index');
});

app.get('/favicon.ico', function(req,res) {

});

app.get('/home', function (req,res) {
	res.render('index');
});

app.get('/netcode', function (req,res) {
	res.render('netcode');
});

app.get('/projects', function (req,res) {
	res.render('projects');
});

app.get('/login', function (req,res) {
	res.render('login');
});

app.get('/register', function (req,res) {
	res.render('register');
});

app.get('/code', function (req,res) {
	res.render('code');
});

// dynamic download function
app.get('/download', function (req,res) {

});

app.listen(port,function (err) {
	if(err)
	{
		console.log(err);
	}	
	console.log('Running on ' + port);
});















