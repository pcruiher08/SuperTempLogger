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
				console.log("", data);
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
						{/* fetch("api/record/create", {
							method: "post",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								record: {
									code:
										"5631b87a-4b77-48ba-99a4-8777baf96e45",
									group: "5f4af874a8ed837950ee0d16",
									temp: 97.2,
								},
							}),
						}).then((res) => {
							console.log(res);
						}); */}
					}}
				>
					Create group
				</Button>
			</div>
		);
	}
}

export default withRouter(Dashboard);
