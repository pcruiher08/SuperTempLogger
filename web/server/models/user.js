const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");

const Schema = mongoose.Schema;
const User = new Schema({
	email: { type: String, unique: true, required: true, dropDups: true },
	username: String,
	name: String,
	password: String,
	code: String,
	active: Boolean,
	admin: Boolean,
});

User.plugin(passportLocalMongoose, {
	// Set usernameUnique to false to avoid a mongodb index on the username column
	usernameUnique: false,

	findByUsername: function (model, queryParameters) {
		queryParameters.active = true;
		return model.findOne(queryParameters);
	},
});

const Users = mongoose.model("user", User, "users");

passport.use(Users.createStrategy());

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());


module.exports = Users;
