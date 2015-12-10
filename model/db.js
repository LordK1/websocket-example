/**
 * Created by k1 on 12/11/15.
 */
var mongoose = require('mongoose');
var User = require('./user');
var Message = require('./message');

const dbUrl = 'mongodb://localhost/chattr-db';

mongoose.connect(dbUrl, function (err) {
    if (err) {
        console.log('Mongoose Error : ', err);
    } else {
        console.log("Mongoose Connection Successfully !!!");
    }
});
