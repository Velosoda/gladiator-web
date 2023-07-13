var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var crypto = require('crypto');

//valid payload 
/*
    {
        "user": {
            "email": "jake@example.com".
            "password": "mypasswordisjake"
        }
    }
*/
//param1 = get the email in the user object in the payload
//param2 = get password from user object in the payload

passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]'
}, function verify(email, password, done) {
    User.findOne({ email: email }).then(function (user) {
        if (!user || !user.validPassword(password)) {
            return done(null, false, {
                errors: { 'email or password': 'is invalid' }
            });
        }
        return done(null, user);
    }).catch(done);
}));


// passport.use(new LocalStrategy({
//     usernameField: 'user[email]',
//     passwordField: 'user[password]'
// }, function (email, password, done) {
//     //find one will return the user with the email specified
//     User.findOne({ email: email }).then(function (user) {

//         //user is then validated with the salt and all that from the method in the schema
//         if (!user || !user.validPassword(password)) {
//             return done(null, false, {
//                 errors: { 'email or password': 'is invalid' }
//             });
//         }
//         return done(null, user);

//     }).catch(done);
// }));

passport.serializeUser(function(user, done) {
    process.nextTick(function() {
      done(null, { username: user.username });
    });
  });
  
  passport.deserializeUser(function(user, done) {
    process.nextTick(function() {
      return done(null, user);
    });
  });