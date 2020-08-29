import React, { Component } from "react";
import { Form, Input, InputNumber, Button, Row, Col } from "antd";

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
export default class SignUp extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const onFinish = (values) => {
			console.log(values);
			fetch("/api/user/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			})
				.then((e) => {
					console.log(e);
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
					name={["user", "name"]}
					label="Name"
					rules={[{ required: true }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name={["user", "username"]}
					label="Username"
					rules={[{ required: true }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name={["user", "email"]}
					label="Email"
					rules={[{ type: "email", required: true }]}
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
