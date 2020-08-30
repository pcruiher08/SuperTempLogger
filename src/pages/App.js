import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import { useHistory } from "react-router-dom";
import { Row, Col, Divider } from "antd";

function App(props) {
	const history = useHistory();
	const [logged, setLogged] = useState(false);
	// process incoming data
	// Update welcomeMessage state
	useEffect(() => {
		fetch("/api/user/data", {
			method: "POST",
		}).then((res) => {
			console.log(res);
			if (res.status == 200) {
				history.push("/user");
				return;
			}
		});
	}, [logged]);
	return (
		<Row>
			<Col span={12}>
				<SignUp></SignUp>
			</Col>
			<Col span={12}>
				<Login></Login>
			</Col>
		</Row>
	);
}

export default App;
