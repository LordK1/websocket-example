/**
 * Created by k1 on 12/10/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    content: String,
    sender_id: {type: Schema.Types.ObjectId, ref: 'User'},
    receiver_id: {type: Schema.Types.ObjectId, ref: 'User'},
    created_at: Date,
    updated_at: Date
});


// on every save, add the date
messageSchema.pre('save', function (next) {
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


module.exports = mongoose.model('Message', messageSchema);