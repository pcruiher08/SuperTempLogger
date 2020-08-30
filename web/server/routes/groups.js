const express = require("express");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const Users = require("../models/user");
const Groups = require("../models/group");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

router.get("/list", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
	const { user } = req;
	if (user.admin) {
		const groups = await Groups.find({
			_id: { $in: user.groups.map((item) => item._id) },
		}).exec();
		return res.json(groups);
	}
	return res.send("User is not an administrator.");
});

router.post(
	"/create",
	connectEnsureLogin.ensureLoggedIn(),
	async (req, res) => {
		const { admin, _id } = req.user;
		console.log(req.body);
		const { groupName, emails } = req.body;
		if (!groupName || !emails) res.status(400).send("Data not provided");

		const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		const filteredEmails = emails
			.filter((email) => emailPattern.test(String(email).toLowerCase()))
			.map((email) => email.toLowerCase());

		if (admin) {
			const userList = await Users.find({
				email: { $in: filteredEmails },
			}).exec();

			const mapped = userList.map((item) => item._id);
			await Groups.create(
				{ name: groupName, userlist: mapped },
				async (err, group) => {
					if (err) throw err;
					await Users.update(
						{ _id },
						{ $addToSet: { groups: group._id } },
						(err, res) => {
							if (err) throw err;
						}
					);
				}
			);
		}
		return res.send("User is not an administrator.");
	}
);

router.post(
	"/append",
	connectEnsureLogin.ensureLoggedIn(),
	async (req, res) => {
		const { group } = req.body;
		if (admin) {
			const userList = await Users.find({
				email: { $in: group.users },
			}).exec();

			const mapped = userList.map((item) => item._id);
			await Groups.update(
				{ _id: group._id },
				{ $addToSet: { userlist: { $each: mapped } } },
				(err, res) => {
					if (err) throw err;
				}
			);
		}
		return res.send("User is not an administrator.");
	}
);

module.exports = router;
