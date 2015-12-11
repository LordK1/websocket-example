/**
 * Created by k1 on 12/11/15.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// passport config
var User = require('../model/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;