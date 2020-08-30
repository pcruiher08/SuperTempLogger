import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Redirect } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import Login from "./pages/auth/Login";
import App from "./pages/App";
import User from "./pages/User";
import Dashboard from "./pages/dashboard/Dashboard";
import "antd/dist/antd.css";
import { Layout, Menu, Breadcrumb } from "antd";

const { Header, Content, Footer } = Layout;

ReactDOM.render(
	<Layout className="layout">
		<Header>
			<div className="logo" />
			<Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
				<Menu.Item key="1">nav 1</Menu.Item>
				<Menu.Item key="2">nav 2</Menu.Item>
				<Menu.Item key="3">nav 3</Menu.Item>
			</Menu>
		</Header>
		<Content style={{ padding: "0 50px" }}>
			<Breadcrumb style={{ margin: "16px 0" }}>
				<Breadcrumb.Item>Home</Breadcrumb.Item>
				<Breadcrumb.Item>List</Breadcrumb.Item>
				<Breadcrumb.Item>App</Breadcrumb.Item>
			</Breadcrumb>
			<Router>
				<Route exact path="/" component={App} />
				<Route exact path="/user" component={User} />
				<Route exact path="/dashboard" component={Dashboard} />
				<Redirect from="/login" to="/" />
			</Router>
		</Content>
		<Footer style={{ textAlign: "center" }}>
			Ant Design ©2018 Created by Ant UED
		</Footer>
	</Layout>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
