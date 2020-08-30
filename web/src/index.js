import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Link,
} from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import Login from "./pages/auth/Login";
import App from "./pages/App";
import User from "./pages/User";
import Dashboard from "./pages/dashboard/Dashboard";
import "antd/dist/antd.css";
import "./index.css";
import { Layout, Menu, Button } from "antd";
import {
	MailOutlined,
	AppstoreOutlined,
	SettingOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;
const { Header, Content, Footer } = Layout;

const style = {
	width: "120px",
	height: "31px",
	background: "rgba(255, 255, 255, 0.2)",
	margin: "16px 24px 16px 0",
	float: "left",
};

export const UserContext = React.createContext({
	loggedIn: false,
	user: null,
	setLogged: () => {},
	setUser: () => {},
	logOut: () => {},
	updateUser: () => {},
	getUser: () => {},
});

class Root extends Component {
	constructor(props) {
		super(props);

		this.setLogged = (logged) => {
			this.setState((state) => ({
				loggedIn: logged,
			}));
		};

		this.setUser = (user) => {
			this.setState((state) => ({
				loggedIn: true,
				user,
			}));
		};

		this.getUser = async () => {
			await fetch("/api/user/data", {
				method: "POST",
			})
				.then((response) => {
					if (response.status == 200) {
						return response.json();
					}
				})
				.then((data) => {
					this.setState({
						user: data,
						loggedIn: true,
					});
					return;
				});
		};

		this.logOut = async (user) => {
			await fetch("api/user/logout");
			this.setState((state) => ({
				loggedIn: false,
				user: null,
			}));
		};

		this.updateUser = async (user) => {
			if (!this.state.loggedIn) return;
			await fetch("/api/user/update", {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					updates: user,
				}),
			});
			await fetch("/api/user/data", {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					this.setState((state) => ({
						user: data,
					}));
				});
		};

		this.state = {
			loggedIn: false,
			user: null,
			setLogged: this.setLogged,
			setUser: this.setUser,
			logOut: this.logOut,
			updateUser: this.updateUser,
			getUser: this.getUser,
		};
	}

	render() {
		return (
			<UserContext.Provider value={this.state}>
				<Router>
					<Layout style={{ minHeight: "100vh" }}>
						<Header
							style={{
								position: "fixed",
								zIndex: 1,
								width: "100%",
							}}
						>
							{/* <div style={style} /> */}
							<Menu
								theme="dark"
								mode="horizontal"
								style={{
									display: "flex",
									justifyContent: "flex-end",
								}}
								selectedKeys={[]}
							>
								{this.state.loggedIn &&
								this.state.user &&
								!this.state.user.admin ? (
									<Menu.Item className="menu-nohover">
										<Button
											type="primary"
											shape="round"
											onClick={() =>
												this.state.updateUser({
													admin: true,
												})
											}
										>
											Conviertete en administrador
										</Button>
									</Menu.Item>
								) : null}

								{this.state.loggedIn && this.state.user ? (
									<SubMenu
										icon={<SettingOutlined />}
										title={this.state.user.username}
										key="-"
										{...this.props}
									>
										<Menu.Item>
											<Link to="/user">Perfil</Link>
										</Menu.Item>
										<Menu.Item onClick={this.state.logOut}>
											Cerrar Sesión
										</Menu.Item>
									</SubMenu>
								) : (
									<Menu.Item key="3"></Menu.Item>
								)}

								{/* 
				<Menu.Item key="2">nav 2</Menu.Item>
				<Menu.Item key="3">nav 3</Menu.Item> */}
							</Menu>
						</Header>
						<Content
							style={{
								paddingTop: 64,
								backgroundColor: "#fff",
								height: "100%",
							}}
						>
							{/* <Breadcrumb style={{ margin: "16px 0" }}>
				<Breadcrumb.Item>Home</Breadcrumb.Item>
				<Breadcrumb.Item>List</Breadcrumb.Item>
				<Breadcrumb.Item>App</Breadcrumb.Item>
			</Breadcrumb> */}
							<div
								style={{
									height: "100%",
								}}
							>
								<Route exact path="/" component={App} />
								<Route exact path="/user" component={User} />
								<Route
									exact
									path="/dashboard"
									component={Dashboard}
								/>
								<Redirect from='/login' to="/" />
							</div>
						</Content>
						<Footer
							style={{
								textAlign: "center",
								backgroundColor: "#fff",
							}}
						>
							TempLogger 2020
						</Footer>
					</Layout>
				</Router>
			</UserContext.Provider>
		);
	}
}

ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
