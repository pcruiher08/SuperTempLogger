import React, { Component } from "react";
import { Form, Input, InputNumber, Button, Row, Col } from "antd";
import { withRouter } from "react-router-dom";

const layout = {
	labelCol: { span: 4 },
	wrapperCol: { span: 20 },
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
			<Form
				{...layout}
				name="nest-messages"
				onFinish={onFinish}
				validateMessages={validateMessages}
			>
				<Form.Item
					name={["user", "username"]}
					label="Username"
					rules={[{ required: true }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name={["user", "password"]}
					label="Password"
					rules={[{ required: true }]}
				>
					<Input />
				</Form.Item>
				<Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		);
	}
}
export default withRouter(Login);
