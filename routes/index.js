/**
 * Created by k1 on 12/9/15.
 */
var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
});

router.get('/', function (req, res) {
    var drinks = [
        {name: 'Bloody Mary', drunkness: 3},
        {name: 'Martini', drunkness: 5},
        {name: 'Scotch', drunkness: 7}
    ];
    var tagline = "Any Code of your own that you haven't looked at for six or more months might as well have been written by someone else !!! "
    res.render('home', {
        title: 'Home',
        user: req.user,
        drinks: drinks,
        tagline: tagline
    });
});

// Chat page
router.get('/chat', function (req, res) {
    res.render('chat', {
        title: 'Chat',
        user: req.user
    });
});

module.exports = router;