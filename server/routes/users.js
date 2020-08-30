const express = require("express");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const Users = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

router.post("/login", (req, res) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			throw err;
		}

		if (!user) {
			return res.status(500).send("Unexistent user");
		}

		req.logIn(user, function (err) {
			if (err) {
				throw err;
			}

			return res.status(200).send("ok");
		});
	})(req, res);
});

router.post("/signup", (req, res, next) => {
	const { name, username, email, password } = req.body.user;
	const response = {
		code: 200,
		msg: "Ok",
	};
	Users.register(
		{ name, username, email, code: uuidv4(), admin: false, active: true },
		password,
		function (err, user) {
			if (err) {
				response.code = 500;
				response.msg = err;
				throw err;
			}

			var authenticate = Users.authenticate();
			authenticate(user.username, password, function (err, result) {
				if (err) {
					response.code = 500;
					response.msg = "Authentication Error";
				}
				if (!result) {
					response.code = 403;
					response.msg = "Non activated user";
				}
			});

			req.logIn(user, function (err) {
				if (err) {
					response.code = 500;
					throw err;
				}
			});
		}
	);
	return res.status(response.code).send(response.msg);
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
		if (admin !== undefined) user.admin = admin;
		if (newUsername !== undefined) user.username = newUsername;
		if (admin !== undefined) user.admin = admin;
		if (email !== undefined) user.email = email;
		if (name !== undefined) user.name = name;
		if (password) {
			await user.setPassword(password, async () => {
				await user.save();
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
