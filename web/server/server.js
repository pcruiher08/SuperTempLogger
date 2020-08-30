require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const expressSession = require("express-session")({
	secret: "secret",
	resave: false,
	saveUninitialized: false,
});
const mongoose = require("mongoose");
const httpProxy = require("http-proxy");
const User = require("./models/user");
const userRouter = require("./routes/users");
const groupRouter = require("./routes/groups");
const recordRouter = require("./routes/records");
const proxy = httpProxy.createServer({});
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.use("/api/user", userRouter);
app.use("/api/group", groupRouter);
app.use("/api/record", recordRouter);

if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
	app.get("*", (req, res) => {
		if (req.originalUrl !== "/login")
			proxy.web(req, res, { target: "http://localhost:3000/" });
	});
} else {
	app.use(express.static(path.join(__dirname, "../build")));
	app.get("*", (req, res) => {
		if (req.path !== "/login")
			res.sendFile(path.resolve(__dirname, "../build", "index.html"));
		else {
			res.status(500).send('Not logged in');
		}
	});
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server started on PORt ${port}`);
});
