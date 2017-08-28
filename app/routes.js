module.exports = function(app, mongo, passport) {

    app.get('/', function (req,res) {
	    res.render('index');
    });

    app.get('/home', function (req,res) {
        res.redirect('/');
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

    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login', {
            message: req.flash('loginMessage')
        }); 
    });

    // process the login form
    app.post('/login', function() {
        mongo.connect(app.get('mongoUrl'), function(err, db) {
            if (err) throw err;
            var myobj = { username: "Company Inc", password: "Highway 37" };
            db.collection("netcode-users").findOne(myobj, function(err, res) {
                if (err) throw err;
                db.close();
            });
        });
    });

    app.get('/register', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('register', { message: req.flash('signupMessage') });
    });

    app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/register', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user 
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}