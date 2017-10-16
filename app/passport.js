// expose this function to our app using module.exports
module.exports = function(passport) {
    
    // used to serialize the user for the session
    passport.serializeUser(function(id, done) {
        done(null, id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
       done(null, id);
    });
};