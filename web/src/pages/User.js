import React, { Component, useState, useEffect } from "react";
import { Form, Input, InputNumber, Button, Row, Col, Space } from "antd";
import { useHistory } from "react-router-dom";
import QRCode from "qrcode.react";

const User = () => {
	const [userData, setUserData] = useState({});
	const history = useHistory();
	useEffect(() => {
		fetch("/api/user/data", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				setUserData(data);
			});
	}, []);

	if (Object.keys(userData).length === 0)
		return <p>Esta cargando este pedo</p>;

	return (
		<Row>
			<Col span={12} offset={6}>
				<QRCode value={userData.code} />
				<p>{userData.name}</p>
				<p>{userData.username}</p>
				<p>{userData.email}</p>
				<button
					onClick={() => {
						fetch("/api/user/update", {
							method: "post",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								updates: {
									admin: true,
								},
							}),
						})
							.then(function (response) {
								console.log(response);
							})
							.catch((err) => {
								console.log(err);
							});
					}}
				>
					become an admin
				</button>
				{userData.admin ? (
					<button
						onClick={() => {
							history.push("/dashboard");
						}}
					>
						Ve a dashboard
					</button>
				) : null}
			</Col>
		</Row>
	);
};

export default User;
