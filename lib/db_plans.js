/**
 * Created by JS on 2016-06-19 (019).
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//스키마
var planSchema = new Schema({
    name: {type: String, required: true},
    creator: {type: Schema.Types.ObjectId, required: true, ref: 'users'},
    friends: [{type: Schema.Types.ObjectId, ref: 'users'}],
    dest: {
        lat: {type: Number, required: true},
        lng: {type: Number, required: true}
    },
    destName: {type: String, required: true},
    timestamp: {type: Number, required: true},
    timestamp2: {type: Number, required: true}
});

module.exports = mongoose.model('plans', planSchema);