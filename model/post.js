/**
 * Created by k1 on 12/11/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    link: String,
    content: String,
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    created_date: Date,
    updated_date: Date,
    likes: Number
});

// add some functionality here

module.exports = mongoose.model('Post', postSchema);