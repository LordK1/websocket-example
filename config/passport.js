/**
 * Created by k1 on 12/11/15.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// passport config
var User = require('../model/user');
passport.use(new LocalStrategy(User.authenticate()));

/*passport.use(new LocalStrategy(
    function (username, password, done) {

        User.findOne({username: username}, function (err, user) {

            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {alert: 'Incorrect username.'});
            }
            if (user.password != password) {
                return done(null, false, {alert: 'Incorrect password.'});
            }
            return done(null, user);
        });
    }
));*/

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById({_id:id}, function (err, user) {
        done(err, user);
    });
});


module.exports = passport;