const express = require("express");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const Users = require("../models/user");
const Groups = require("../models/group");
const Records = require("../models/record");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

router.post("/list/group", async (req, res) => {
	const { groupId } = req.body;
	const records = await Records.find({
		group: mongoose.Types.ObjectId(groupId),
	}).populate("user").exec();
	
	return res.json(records);
});

router.get("/list/user", async (req, res) => {
	const { userId } = req.body;
	const records = await Records.find({
		user: mongoose.Types.ObjectId(userId),
	}).exec();

	return res.json(records);
});

router.get("/list", async (req, res) => {
	const records = await Records.find().exec();

	return res.json(records);
});

router.post("/create", async (req, res) => {
	const { record } = req.body;

	const user = await Users.findOne({
		code: record.code,
	}).exec();

	return await Records.create(
		{
			user: user._id,
			group: mongoose.Types.ObjectId(record.group),
			date: new Date(),
			temp: parseFloat(record.temp),
		},
		async (err, group) => {
			if (err) return res.status(500);
			return res.status(200).send("Record created");
		}
	);
});

module.exports = router;
