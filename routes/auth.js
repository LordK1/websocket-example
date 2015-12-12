/**
 * Created by k1 on 12/10/15.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../model/user');

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())return next();
    res.send(401);
}

router.get('/register', function (req, res) {
    res.render('register', {
        title: "Registration Page",
        message: req.flash('signupMessage')
    });
});

router.post('/register', function (req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if (err) {
            req.flash('signupMessage', 'That email is already taken.');

            return res.render('register', {
                User: user,
                title: "Registration Page"
            });
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/')
        });
    });
});

router.get('/login', function (req, res) {
    res.render('login', {title: "LOGIN", message: req.flash('failureFlash')});
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: "Login Successful ! "
}), function (req, res) {
    res.redirect('/');
});


router.get('/profile', isAuthenticated, function (req, res) {
    res.render('profile');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});



module.exports = router;