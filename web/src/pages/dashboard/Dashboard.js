import React, { useState, useEffect, useContext } from "react";
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
	Table,
	Tag,
} from "antd";

import { UserContext } from "../../index";
import { useHistory, Redirect } from "react-router-dom";
const { Content, Sider } = Layout;
const { Text, Paragraph } = Typography;
const { Option } = Select;

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
	const context = useContext(UserContext);
	const [visible, setVisible] = useState(false);
	const [userData, setUserData] = useState(context ? context.user : {});
	const [key, setKey] = useState("1");
	const [selected, setSelected] = useState(
		context.user && context.user.groups.length > 0 ? context.user.groups[0]._id : ""
	);
	const [records, setRecords] = useState([]);
	const [trigger, setTrigger] = useState(false);
	const history = useHistory();

	useEffect(() => {
		if (Object.keys(userData).length != 0) {
			fetch("/api/record/list/group", {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					groupId: selected,
				}),
			})
				.then(function (response) {
					return response.json();
				})
				.then(function (data) {
					setRecords(data);
				});
		}
	}, [selected]);

	if (!context.loggedIn) {
		return <Redirect to="/" />;
	}

	const onCreate = (values) => {
		fetch("/api/group/create", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		})
			.then(async (res) => {
				await fetch("/api/user/data", {
					method: "POST",
				})
					.then((response) => {
						if (response.status == 200) {
							return response.json();
						}
					})
					.then((data) => {
						context.setUser(data);
						setUserData(data);
						return;
					});
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
					style={{ height: "100%", borderRight: 0 }}
					onClick={({ key: k }) => setKey(k)}
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
					<Button
						type="primary"
						style={{
							width: "100%",
							margin: "6px 0",
						}}
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
					<Menu.Item key="1">Registros</Menu.Item>
					<Menu.Item key="2">Resumen</Menu.Item>
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
					{(() => {
						if (key == "1") {
							return (
								<Table
									columns={[
										{
											title: "Temperatura",
											key: "temp",
											dataIndex: "temp",
											render: (text) =>
												parseFloat(text) > 37 ? (
													<Tag color="red">
														{text}
													</Tag>
												) : (
													<Tag color="default">
														{text}
													</Tag>
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
										user: record.user
											? record.user.name
											: "",
									}))}
								/>
							);
						} else if (key == "2") {
							return (
								<img
									src="https://www.researchgate.net/profile/Rebecca_Harris5/publication/258504178/figure/fig5/AS:669657803526148@1536670270221/Frequency-histogram-of-field-body-temperature-in-Phaulacridium-vittatum-doi.ppm"
									alt=""
								/>
							);
						}
					})()}
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
