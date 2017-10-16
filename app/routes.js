module.exports = function(app, io, mongo, passport) {

    io.sockets.on('connection',function(socket) {
        socket.on("codeUpdate",function(data) {
            console.log(data);
            //Check to see if this user is able to edit project
            //socket.broadcast.to(data.room).emit('codeUpdate', data);
            socket.broadcast.emit('codeUpdate', data);
        })
    });

    function createGuid() {
        function s() { 
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16).substring(1);
        }
        return s() + s() + '-' + s() + '-' + s() + '-' +
            s() + '-' + s() + s() + s();
    }

    home = function (req,res) {
        if(req.isAuthenticated()) {
            console.log(req.username);
        }
	    res.render('index',{
            isLoggedIn: req.isAuthenticated()
        });
    }
    app.get('/', home);
    app.get('/home', home);

    app.get('/netcode', function (req, res) {
        // project, file, room
        if(req.query.p != undefined && 
            req.query.f != undefined &&
            req.query.r != undefined ) {
            res.render('netcode',{
                isLoggedIn: req.isAuthenticated(),
                language: "javascript",
                filename: "netcode.js",
                file: {
                    data: "",
                    name: "",
                    size: ""
                }
            });
        } else {
            res.render('netcode',{
                isLoggedIn: req.isAuthenticated(),
                language: "javascript",
                filename: "netcode.js",
                file: {
                    data: "",
                    name: "",
                    size: ""
                }
            });
        }
    });

    app.get('/create', function (req, res) {
        mongo.connect(app.get('mongoUrl'), function(err, db) {
            if (err) throw err;
            var username = req.fields.Username;
            db.collection("netcode_users").findOne({username:username},function(err,result) {
                if(result == null) {
                db.collection("netcode_users").insertOne({
                    username: username,
                    password: password,
                    followers: {}
                }, function(err, result) {
                    if (err) throw err;
                    req.login(result.insertedId, function(err) {
                        res.redirect('/');
                    })
                    db.close();
                });
               } else {
                   req.flash('alert alert-danger','<b>Sorry!</b> That username is already taken.');
                   res.render('register', {
                       isLoggedIn: req.isAuthenticated()
                   });
               }
            })

        });
    });

    app.get('/projects/:projectname', function (req,res) {
        res.redirect('project?pn='+req.params.username);
    });

    app.get('/projects', function (req,res) {
        if(obj.username != req.user.username) {
            mongo.connect(app.get('mongoUrl'), function(err, db) {
                db.collection("netcode_projects").find({
                    username: obj.username
                },{ personalInfo : true }).toArray(function(err, result) {
                    if (err) throw err;
                    if(result[0].personalInfo) {
                        obj = Object.assign(result[0],obj);
                        console.log(obj);
                        console.log('obj exists');
                    }
                    res.render('profile', {
                        user : obj,
                        OtherAccount : true,
                        isLoggedIn : req.isAuthenticated()
                    });
                    db.close();
                });
            });
            return;
        }

        res.render('projects',{
            isLoggedIn: req.isAuthenticated()
        });
    });

    app.get('/code', function (req,res) {
        res.render('code', {
            isLoggedIn: req.isAuthenticated(),
            language: "javascript",
            filename: "netcode.js"
        });
    });

    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login', {
            isLoggedIn: req.isAuthenticated()
        }); 
    });

    // process the login form
    app.post('/login', function(req, res) {
        mongo.connect(app.get('mongoUrl'), function(err, db) {
            if (err) throw err;
            db.collection("netcode_users").findOne({
                username: req.fields.Username,
                password: req.fields.Password
            }, function(err, result) {
                if (err) throw err;
                if(result == null) {
                    req.flash('alert alert-danger','<b>Sorry!</b> Incorrect login information.');
                    res.render('login',{
                        isLoggedIn: req.isAuthenticated()
                    });
                } else {
                    req.login(result, function() {
                        req.username = result.username;
                        console.log(req.username);
                        res.redirect('/');
                    });
                }
                db.close();
            });
        });
    });

    app.get('/register', function(req, res) {
        res.render('register', {
            isLoggedIn: req.isAuthenticated()
        });
    });

    app.post('/register', function(req, res) {
        mongo.connect(app.get('mongoUrl'), function(err, db) {
            if (err) throw err;
            var username = req.fields.Username;
            var password = req.fields.Password;
            if(password != req.fields.ConfirmPassword) {
                    req.flash('alert alert-warning','Passwords do not match');
                    res.render('register', {
                       isLoggedIn: req.isAuthenticated()
                   });
                return;
            }
            db.collection("netcode_users").findOne({username:username},function(err,result) {

                if(result == null) {
                db.collection("netcode_users").insertOne({
                    username: username,
                    password: password,
                    followers: {}
                }, function(err, result) {
                    if (err) throw err;
                    req.login(result.insertedId, function(err) {
                        res.redirect('/');
                    })
                    db.close();
                });
               } else {
                   req.flash('alert alert-danger','<b>Sorry!</b> That username is already taken.');
                   res.render('register', {
                       isLoggedIn: req.isAuthenticated()
                   });
               }
            })

        });
    });

    app.get('/profile', function(req, res) {
        if(!req.isAuthenticated())
            return res.redirect('login');

        if(req.query.u != undefined) {

            var obj = { username: req.query.u };

            if(obj.username != req.user.username) {

                mongo.connect(app.get('mongoUrl'), function(err, db) {
                    
                    db.collection("netcode_users").find({
                        username: obj.username
                    },{ personalInfo : true }).toArray(function(err, result) {
                        if (err) throw err;
                        if(result[0].personalInfo) {
                            obj = Object.assign(result[0],obj);
                            console.log(obj);
                            console.log('obj exists');
                        }

                        res.render('profile', {
                            user : obj,
                            OtherAccount : true,
                            isLoggedIn : req.isAuthenticated()
                        });
                        
                        db.close();
                    });
                });
                return;
            }
        }

        obj = req.user;
        delete obj.password;
        res.render('profile', {
            user : obj,
            OtherAccount : false,
            isLoggedIn : req.isAuthenticated(),
            query_var: req.query.id
        });

    });

    app.get('/profile/:username', function(req, res) {
        res.redirect('/profile?u='+req.params.username);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};