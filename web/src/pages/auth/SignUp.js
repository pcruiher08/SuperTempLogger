import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Row, Col, Typography } from "antd";
import { withRouter } from "react-router";
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
const SignUp = () => {
	const [form] = Form.useForm();
	const [success, setSuccess] = useState(false);

	const onFinish = (values) => {
		console.log(values);
		fetch("/api/user/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		})
			.then((res) => {
				if (res.status === 200) {
					form.resetFields();
					setSuccess(true);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div style={{ padding: "24px" }}>
			<div style={{ textAlign: "center" }}>
				<Title level={3}>Registrate</Title>
			</div>
			<Form
				{...layout}
				name="nest-messages"
				form={form}
				onFinish={onFinish}
				validateMessages={validateMessages}
			>
				<Form.Item
					name={["user", "name"]}
					label="Nombre"
					rules={[{ required: true }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name={["user", "username"]}
					label="Nombre de usuario"
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
			{success ? <Text>Te registraste con éxito</Text> : null}
		</div>
	);
};

export default SignUp;
