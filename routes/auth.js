/**
 * Created by k1 on 12/10/15.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../model/user');

router.get('/register', function (req, res) {
    res.render('register', {
        title: "Registration Page",
        info: req.flash('info'),
        user: req.user
    });
});

router.post('/register', function (req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function (err, User) {
        if (err) {
            req.flash('info', "Sorry. That username already exists. Try again.");
            return res.render('register', {
                User: User,
                user: req.user,
                title: "Registration Page"
            });
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/')
        });
    });
});

router.get('/login', function (req, res) {
    res.render('login', {user: req.user, title: "LOGIN", info: req.flash('info')});
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: "Invalid username or password",
    successFlash: "Login Successful ! "
}), function (req, res) {
    res.redirect('/');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;