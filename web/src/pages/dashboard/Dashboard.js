import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { Button, Modal, Form, Input, Radio, Select } from "antd";
import { json } from "body-parser";
const { Option } = Select;

function handleChange(value) {
	console.log(`selected ${value}`);
}

const TagSelect = () => {};

const CreateGroupForm = ({ visible, onCreate, onCancel }) => {
	const [form] = Form.useForm();
	const [emails, setEmails] = useState([]);
	const [name, setName] = useState("");
	return (
		<Modal
			visible={visible}
			title="Create a new collection"
			okText="Crear"
			cancelText="Cancelar"
			onCancel={onCancel}
			onOk={() => {
				form.validateFields()
					.then((values) => {
						form.resetFields();
						onCreate(values);
					})
					.catch((info) => {
						console.log("Validate Failed:", info);
					});
			}}
		>
			<Form
				form={form}
				layout="vertical"
				name="form_in_modal"
				initialValues={{ modifier: "public" }}
			>
				<Form.Item name="groupName" label="Nombre del grupo">
					<Input
						onChange={(value) => {
							setName(value);
						}}
					/>
				</Form.Item>
				<Form.Item
					name="emails"
					label="Emails"
					rules={[
						{
							required: true,
							message: "introuzca una lista de correos",
						},
					]}
				>
					<Select
						mode="tags"
						style={{ width: "100%" }}
						dropdownStyle={{ display: "none" }}
						onChange={(value) => {
							setEmails(value);
						}}
					></Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

const Dashboard = () => {
	const [visible, setVisible] = useState(false);
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
				console.log("", data);
				// if (data.username && !data.admin) {
				// 	this.props.history.push("/user");
				// }
			});
	}, []);

	const onCreate = (values) => {
		console.log(values);
		fetch("/api/group/create", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				throw err;
			});
		setVisible(false);
	};

	return (
		<div>
			<Button
				type="primary"
				onClick={() => {
					setVisible(true);
				}}
			>
				New Collection
			</Button>
			<CreateGroupForm
				visible={visible}
				onCreate={onCreate}
				onCancel={() => {
					setVisible(false);
				}}
			/>
		</div>
	);
};
{
	/* fetch("/api/record/create", {
	method: "post",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		record: {
			code:
				"5631b87a-4b77-48ba-99a4-8777baf96e45",
			group: "5f4af874a8ed837950ee0d16",
			temp: 93.2,
		},
	}),
}).then((res) => {
	console.log(res);
}); */
}
export default Dashboard;
