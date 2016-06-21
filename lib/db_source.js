var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var srcSchema = new Schema({
	"user_id": { type: Schema.Types.ObjectId, required: true, ref: "users" },
	"plan_id": { type: Schema.Types.ObjectId, required: true, ref: "plans" },
	"current": { type: Boolean, default: false },
	"src": {
		"lat": { type: Number, required: true },
		"lng": { type: Number, required: true }
	},
	"srcName": { type: String, required: true }
});
module.exports = mongoose.model('sources', srcSchema);