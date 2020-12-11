import React from "react";
// import io from "socket.io-client";
import { socket } from "./service/socket";
import Splendor from "./Splendor";

// const socket = io.connect("http://localhost:4000");

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			socket: socket,
			dt: "Waiting...",
			socketConnected: false
		};
	}

	componentDidMount() {
		if (!socket) return;

		socket.on("connect", () => {
			socket.emit("new player", Math.random() * 100);
			this.setState({ socketConnected: socket.connected });
			// this.subscribeToEvent();
		});

		socket.on("disconnect", () => {
			this.setState({ socketConnected: socket.connected });
			console.log("Disconnected...");
		});

		socket.on("disconnected user", () => {
			console.log("User disconnected");
		});
	}

	// manage socket connection
	// handleSocketConnection() {
	// 	if (this.state.socketConnected)
	// 		socket.disconnect();
	// 	else {
	// 		socket.connect();
	// 	}
	// }

	render() {
		return (
			<div>
				{/* <b>Connection status:</b> {this.state.socketConnected ? "Connected" : "Disconnected"}
				<button onClick={this.handleSocketConnection.bind(this)}>{this.state.socketConnected ? "Disconnect" : "Connect"}</button>*/}
				<Splendor />
			</div>
		);
	}
}