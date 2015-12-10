/**
 * Created by k1 on 12/10/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    content: String,
    user_id: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Message', messageSchema);