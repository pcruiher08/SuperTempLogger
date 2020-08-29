const express = require("express");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const Users = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

router.post("/login", (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			return next(err);
		}

		if (!user) {
			return res.status(500).send("Usuario no existente");
		}

		req.logIn(user, function (err) {
			if (err) {
				throw err;
			}

			return res.status(200).send("ok");
		});
	})(req, res, next);
});

router.post("/signup", (req, res, next) => {
	const { name, username, email, password } = req.body.user;
	Users.register(
		{ name, username, email, code: uuidv4(), admin: false, active: true },
		password,
		function (err, user) {
			if (err) {
				throw err;
			}

			var authenticate = Users.authenticate();
			authenticate(user.username, password, function (err, result) {
				if (err) {
					throw err;
				}
				// Value 'result' is set to false. The user could not be authenticated since the user is not active
			});

			req.logIn(user, function (err) {
				if (err) {
					throw err;
				}

				return res.status(200);
			});
		}
	);
});

router.post(
	"/update",
	connectEnsureLogin.ensureLoggedIn(),
	async (req, res) => {
		const { username } = req.user;
		const {
			username: newUsername,
			name,
			email,
			admin,
			password,
		} = req.body.updates;
		const user = await Users.findOne({ username: username }).exec();
		console.log(admin);
		if (admin !== undefined) user.admin = admin;
		if (newUsername !== undefined) user.username = newUsername;
		if (admin !== undefined) user.admin = admin;
		if (email !== undefined) user.email = email;
		if (name !== undefined) user.name = name;
		console.log(user);
		if (password) {
			user.setPassword(password, function () {
				user.save();
			});
		}
		await user.save();
		return res.status(200).send("Information was updated");
	}
);

router.post("/data", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
	const { username, code, name, email, admin } = req.user;
	return res.json({ username, code, name, email, admin });
});

module.exports = router;
