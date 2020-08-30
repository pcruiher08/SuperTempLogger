import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import { useHistory } from "react-router-dom";
import { UserContext } from "../index";
import { Row, Col, Divider } from "antd";

function App(props) {
	const history = useHistory();
	const context = useContext(UserContext);
	useEffect(() => {
		if (!context.loggedIn) {
			fetch("/api/user/data", {
				method: "POST",
			})
				.then(function (response) {
					if (response.status == 200) {
						return response.json();
					}
				})
				.then(function (data) {
					context.setUser(data);
					history.push("/user");
					return;
				});
		}
	}, []);
	console.log("->>", context);
	if (context.loggedIn) history.push("/user");
	return (
		<Row>
			<Col flex="1 1 500px">
				<SignUp></SignUp>
			</Col>
			<Col flex="1 1 500px">
				<Login></Login>
			</Col>
		</Row>
	);
}

export default App;
