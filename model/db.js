/**
 * Created by k1 on 12/11/15.
 */
var mongoose = require('mongoose');
var User = require('./user');
var Message = require('./message');
var Post = require('./post');
var config = require('../config');

//const dbUrl = 'mongodb://localhost/chattr-db';

mongoose.connect(config.DB_URL, function (err) {
    if (err) {
        console.log('Mongoose Error : ', err);
    } else {
        console.log("Mongoose Connection Successfully !!!");
    }
});
