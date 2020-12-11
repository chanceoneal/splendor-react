import React from "react";
import { socket } from "./service/socket";
import Bank from "./Bank";

export default class Splendor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			connectedPlayers: 0,
			gameReady: false,
			gameStarted: false,
		};
	}
	componentDidMount() {
		socket.on("new player", (connectedPlayers, name) => {
			console.log("New player connected:", name);
			console.log("Connected players:", connectedPlayers);

			this.setState({ connectedPlayers: connectedPlayers, gameReady: connectedPlayers >= 2 });
		});

		socket.on("disconnected player", (connectedPlayers, disconnectedPlayer) => {
			console.log("Player disconnected:", disconnectedPlayer);
			console.log("Connected players:", connectedPlayers);

			this.setState({ connectedPlayers: connectedPlayers });
		});

		socket.on("start game", () => {
			console.log("Game started");
			this.setState({ gameStarted: true, gameReady: false})
		});

		socket.on("end game", (connectedPlayers) => {
			this.setState({ gameReady: connectedPlayers >= 2, gameStarted: false });
		});
	}

	startGame() {
		console.log("New game clicked");
		socket.emit("new game");
	}

	render() {
		return (
			<div>
				<h1>Splendor</h1>
				<button disabled={!this.state.gameReady || this.state.gameStarted} onClick={this.startGame}>New Game</button>

				{this.state.gameStarted ? <Bank players={this.state.connectedPlayers} /> : null}
				
			</div>
		);
	}
}