/**
 * Created by k1 on 12/10/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    username: String,
    password: String,
    created_at: Date,
    updated_at: Date
});

userSchema.methods.findStatus = function () {
    this.username = this.username + " is Online !";
    return this.username;
}

// on every save, add the date
userSchema.pre('save', function (next) {
//    get current date
    var currentDate = new Date();
//    change updated_at field to current date
    this.updated_at = currentDate;

//    if created_at doesn't exist, add to that field
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    next();
});

userSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', userSchema);
module.exports = User;