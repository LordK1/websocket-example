/**
 * Created by k1 on 12/11/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    link: String,
    content: String,
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    created_at: Date,
    updated_at: Date,
    likes: Number
});

// on every save, add the date
postSchema.pre('save', function (next) {
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

// add some functionality here

module.exports = mongoose.model('Post', postSchema);