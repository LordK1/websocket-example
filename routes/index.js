/**
 * Created by k1 on 12/9/15.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

router.use(function (req, res, next) {
    console.log(req.method, req.url, req.session.passport);
    res.locals.isAuthenticated = req.isAuthenticated()
    res.locals.user = req.user;
    next();
});


router.get('/', function (req, res) {
    res.render('home', {
        title: 'Home'
    });
});

// Chat page
router.get('/chat', function (req, res) {
    res.render('chat', {
        title: 'Chat'
    });
});


module.exports = router;