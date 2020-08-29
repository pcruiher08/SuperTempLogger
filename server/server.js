
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
const proxy = httpProxy.createServer({});
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);
app.use(cors());

// API

// app.use(express.static(path.join(__dirname, "../build")));
// app.get("/", (req, res) => {
// 	console.log('epa')
// 	res.sendFile(path.join(__dirname, "../build"));
// });
// app.get("/login", (req, res) => {
// 	res.sendFile(path.join(__dirname, "../build"));
// });

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server started on PORt ${port}`);
});

app.use(passport.initialize());
app.use(passport.session());

const dbUri =
	"mongodb+srv://admin:admin@templogger.4dihh.mongodb.net/templogger?retryWrites=true&w=majority";
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use("/api/user", userRouter);

app.get("*", (req, res) => {
	console.log(req.originalUrl);
	// change to prod
	if (req.originalUrl !== "/login")
		proxy.web(req, res, { target: "http://localhost:3000/" });
	// res.sendFile(path.join(__dirname + "/../build/index.html"));
});
