import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import Login from "./pages/auth/Login";
import App from "./pages/App";
import User from "./pages/User";
import Dashboard from "./pages/dashboard/Dashboard";
import "antd/dist/antd.css";

ReactDOM.render(
	<div>
		<Router>
			<Route exact path="/" component={App} />
			<Route exact path="/user" component={User} />
			<Route exact path="/dashboard" component={Dashboard} />
			<Redirect from="/login" to="/" />
		</Router>
	</div>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
