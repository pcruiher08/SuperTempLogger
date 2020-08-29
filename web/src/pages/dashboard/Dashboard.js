import React, { Component } from "react";
import { withRouter } from "react-router";

class Dashboard extends Component {
	constructor(props) {
		super(props);
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
				// if (data.username && !data.admin) {
				// 	this.props.history.push("/user");
				// }
			});
	}
	render() {
		return <p>eres admin</p>;
	}
}

export default withRouter(Dashboard);
