import React, { Component } from "react";
import { withRouter } from "react-router";
import { Form, Input, InputNumber, Button, Row, Col, Typography } from "antd";
const { Title, Text } = Typography;

const layout = {
	labelCol: { span: 5, offset: 2 },
	wrapperCol: { span: 12 },
};

const validateMessages = {
	required: "${label} is required!",
	types: {
		email: "${label} is not validate email!",
		number: "${label} is not a validate number!",
	},
	number: {
		range: "${label} must be between ${min} and ${max}",
	},
};

class Login extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const onFinish = (values) => {
			console.log(values);
			fetch("/api/user/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values.user),
			})
				.then((e) => {
					console.log(e);
					if (e.status === 200) {
						this.props.history.push("/user");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		};

		return (
			<div style={{ padding: "24px" }}>
				<div style={{ textAlign: "center" }}>
					<Title level={3}>Inicia Sesión </Title>
				</div>
				<Form
					{...layout}
					name="nest-messages"
					onFinish={onFinish}
					validateMessages={validateMessages}
				>
					<Form.Item
						name={["user", "username"]}
						label="Nombre de usuario"
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name={["user", "password"]}
						label="Contraseña"
						rules={[{ required: true }]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 7 }}>
						<Button type="primary" htmlType="submit">
							Submit
						</Button>
					</Form.Item>
				</Form>
			</div>
		);
	}
}
export default withRouter(Login);
