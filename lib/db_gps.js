/**
 * Created by JS on 2016-06-19 (019).
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//스키마
var gpsSchema = new Schema({
	"user_id": { type: Schema.Types.ObjectId, required: true, unique: true, def: "users" },
	"name": { type: String, required: true },
	"profileUrl": { type: String, required: true},
	"location": {
		"lat": { type: Number, required: true },
		"lng": { type: Number, required: true }
	}
});

module.exports = mongoose.model('gps', gpsSchema);