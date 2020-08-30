import React, { Component, useState, useEffect, useContext } from "react";
import {
	Spin,
	Form,
	Input,
	InputNumber,
	Button,
	Row,
	Col,
	Typography,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useHistory, Redirect } from "react-router-dom";
import QRCode from "qrcode.react";
import { UserContext } from "../index";
const { Title, Text, Paragraph } = Typography;

const User = () => {
	console.log(
		"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
	);
	const history = useHistory();
	const context = useContext(UserContext);
	const [userData, setUserData] = useState(context.user || {});
	if (!context.loggedIn) return <Redirect to="/" />;
	// if (!context.loggedIn) {
	// 	fetch("/api/user/data", {
	// 		method: "post",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 	})
	// 		.then(function (response) {
	// 			return response.json();
	// 		})
	// 		.then(function (data) {
	// 			context.setUser(data);
	// 		})
	// 		.catch((err) => {
	// 			history.push("/");
	// 		});
	// }

	console.log(context.user);

	// if (Object.keys(userData).length === 0)
	// 	return (
	// 		<Spin
	// 			indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
	// 		/>
	// 	);

	if (!context.user) {
		console.log("?????????????????????????????");
		history.push("/");
	}

	return (
		<Row>
			<Col
				xs={{ span: 24, offset: 0 }}
				sm={{ span: 20, offset: 2 }}
				md={{ span: 12, offset: 6 }}
				lg={{ span: 12, offset: 6 }}
			>
				<div style={{ textAlign: "center", padding: "24px" }}>
					<QRCode value={context.user.code} size={300} />
					<Paragraph>Nombre: {context.user.name}</Paragraph>
					<Paragraph>
						Nombre de usuario: {context.user.username}
					</Paragraph>
					<Paragraph>Email: {context.user.email}</Paragraph>
					{context.user.admin ? (
						<button
							onClick={() => {
								history.push("/dashboard");
							}}
						>
							Ve a dashboard
						</button>
					) : null}
				</div>
			</Col>
		</Row>
	);
};

export default User;
