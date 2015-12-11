/**
 * Created by k1 on 12/10/15.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../model/user');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
//    if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    //if they aren't redirect them to the home page
    res.redirect('/');
}

router.get('/register', function (req, res) {
    res.render('register', {
        title: "Registration Page",
        message: req.flash('signupMessage')
    });
});

router.post('/register', function (req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function (err, User) {
        if (err) {
            req.flash('signupMessage', 'That email is already taken.');

            return res.render('register', {
                User: User,
                title: "Registration Page"
            });
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/')
        });
    });
});

router.get('/login', function (req, res) {
    res.render('login', {title: "LOGIN", message: req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: "Invalid username or password",
    successFlash: "Login Successful ! "
}), function (req, res) {
    res.redirect('/');
});


router.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;