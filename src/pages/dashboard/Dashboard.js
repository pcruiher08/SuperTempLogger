import React, { Component } from "react";
import { withRouter } from "react-router";
import { Button } from "antd";

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
		return (
			<div>
				<Button
					onClick={() => {
					}}
				>
					Create group
				</Button>
			</div>
		);
	}
}

export default withRouter(Dashboard);
