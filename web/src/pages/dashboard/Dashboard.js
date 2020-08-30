import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import {
	Button,
	Modal,
	Form,
	Input,
	Radio,
	Typography,
	Select,
	Layout,
	Menu,
	Breadcrumb,
	Table,
	Tag
} from "antd";
import {
	UserOutlined,
	LaptopOutlined,
	NotificationOutlined,
} from "@ant-design/icons";
import { json } from "body-parser";
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option, OptGroup } = Select;

const TagSelect = () => {};

const CreateGroupForm = ({ visible, onCreate, onCancel }) => {
	const [form] = Form.useForm();
	const [emails, setEmails] = useState([]);
	const [name, setName] = useState("");
	return (
		<Modal
			visible={visible}
			title="Crear un nuevo grupo"
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
	const [userData, setUserData] = useState({});
	const [selected, setSelected] = useState("");
	const [records, setRecords] = useState([]);

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
				console.log(data);
				setUserData(data);
				if (data.groups.length > 0) {
					setSelected(data.groups[0]._id);
				}
				// if (data.username && !data.admin) {
				// 	this.props.history.push("/user");
				// }
			});
	}, []);

	useEffect(() => {
		if (Object.keys(userData).length != 0) {
			fetch("/api/record/list/group", {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					// groupId: "5f4af874a8ed837950ee0d16",
					groupId: selected,
				}),
			})
				.then(function (response) {
					return response.json();
				})
				.then(function (data) {
					console.log(data);
					setRecords(data);
					// setUserData(data);
					// if (data.username && !data.admin) {
					// 	this.props.history.push("/user");
					// }
				});
		}
	}, [selected]);

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

	return userData.groups && userData.groups.length > 0 ? (
		<Layout style={{ minHeight: "100vh" }}>
			<Sider width={200} className="site-layout-background">
				<Menu
					mode="inline"
					defaultSelectedKeys={["1"]}
					defaultOpenKeys={["sub1"]}
					style={{ height: "100%", borderRight: 0 }}
				>
					<Select
						defaultValue={userData.groups[0]._id}
						style={{ width: 200 }}
						onChange={(value) => {
							setSelected(value);
						}}
					>
						{userData.groups.map((group) => (
							<Option value={group._id}>{group.name}</Option>
						))}
					</Select>
					<Menu.Item key="1">option1</Menu.Item>
					<Menu.Item key="2">option2</Menu.Item>
					<Menu.Item key="3">option3</Menu.Item>
					<Menu.Item key="4">option4</Menu.Item>
				</Menu>
			</Sider>
			<Layout style={{ padding: "12px 24px 24px" }}>
				<Text>ID: {selected}</Text>
				<Content
					className="site-layout-background"
					style={{
						padding: 24,
						margin: 0,
						minHeight: 280,
					}}
				>
					<Table
						columns={[
							{
								title: "Temperatura",
								key: "temp",
								dataIndex: "temp",
								render: (text) =>
									parseFloat(text) > 37 ? (
										<Tag color="red">{text}</Tag>
									) : (
										<Tag color="default">{text}</Tag>
									),
							},
							{
								title: "Persona",
								key: "user",
								dataIndex: "user",
							},
							{
								title: "Hora",
								key: "date",
								dataIndex: "date",
							},
						]}
						dataSource={records.map((record, idx) => ({
							key: idx,
							temp: record.temp,
							date: record.date,
							user: record.user ? record.user.name : "",
						}))}
					/>
				</Content>
			</Layout>
		</Layout>
	) : (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				height: "100%",
				textAlign: "center",
			}}
		>
			<Paragraph>Aún no tienes grupos</Paragraph>
			<Button
				type="primary"
				onClick={() => {
					setVisible(true);
				}}
			>
				Crear Grupo
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
