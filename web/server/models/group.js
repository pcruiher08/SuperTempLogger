const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Group = new Schema({
	name: String,
	userlist: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
});

const Groups = mongoose.model("Group", Group, "Groups");

module.exports = Groups;
