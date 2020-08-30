const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Record = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	group: {
		type: Schema.Types.ObjectId,
		ref: "Group",
	},
	date: {
		type: Schema.Types.Date,
	},
	temp: {
		type: Schema.Types.Number,
	},
});

const Groups = mongoose.model("Record", Group, "Records");

module.exports = Groups;
