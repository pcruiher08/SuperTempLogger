const express = require("express");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const Users = require("../models/user");
const Groups = require("../models/group");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

router.get("/list", async (req, res) => {
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
	async (req, res) => {
		const { admin, _id } = req.user;
		const { groupName, users } = req.body;
		if (admin) {
			const userList = await Users.find({
				email: { $in: users },
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
