var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var userSchema = new Schema({
	name: {type: String, required: true},
	id_kakao: {type: String, required: true, unique: true},
	profileUrl: {type: String, default: "http://203.252.160.200/data/default.png"}
});
module.exports = mongoose.model('users', userSchema);