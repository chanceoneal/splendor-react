import React from 'react';
import { socket } from "./service/socket";

function Token(props) {
	return (
		<li>
			<button onClick={props.onClick}>
				Get {props.gem} ({props.remaining} left)
			</button>
		</li>
	)
}

export default class Bank extends React.Component {
	constructor(props) {
		super(props); // Need super(props) if we're using this.props in constructor; otherwise, just super()

		let tokensToRemove = 0;
		if (props.players === 3) {
			tokensToRemove = 2;
		} else if (props.players === 2) {
			tokensToRemove = 3;
		}

		this.state = {
			tokens: {
				diamonds: 7 - tokensToRemove,
				sapphires: 7 - tokensToRemove,
				emeralds: 7 - tokensToRemove,
				rubies: 7 - tokensToRemove,
				onyx: 7 - tokensToRemove,
				gold: 5,
			},
			previousToken: null,
			tokensTaken: []
		};
	}

	componentDidMount() {
		socket.on("message", message => {
			console.log(message);
		});
	}

	canTakeToken(gem) {
		const alreadyTookToken = this.state.tokensTaken.includes(gem);
		const tookTwoTokens = this.state.tokensTaken.length === 2 && this.state.tokensTaken[0] === this.state.tokensTaken[1];
		const stackIsEmpty = this.state.tokens[gem] === 0;
		const isGold = gem === "gold";
		return !isGold && !stackIsEmpty && !alreadyTookToken && !tookTwoTokens && this.state.tokensTaken.length < 3;
	}

	canTakeTwoTokens(gem) {
		// Assumes that the previous token was the same as the proposed token
		return this.state.tokens[gem] >= 3;
	}

	discardHand() {
		this.setState({
			tokensTaken: [],
			previousToken: null
		});
	}

	resetTokens() {
		let tokensToRemove = 0;
		if (this.props.players === 3) {
			tokensToRemove = 2;
		} else if (this.props.players === 2) {
			tokensToRemove = 3;
		}

		this.setState({
			tokens: {
				diamonds: 7 - tokensToRemove,
				sapphires: 7 - tokensToRemove,
				emeralds: 7 - tokensToRemove,
				rubies: 7 - tokensToRemove,
				onyx: 7 - tokensToRemove,
				gold: 5,
			},
			previousToken: null,
			tokensTaken: []
		});

		this.discardHand();
	}

	handleClick(event, gem) {
		if (event.ctrlKey) {
			console.log("Control key pressed");
		} else if (event.shiftKey) {
			console.log("Shift key pressed");
		}

		if (this.state.tokensTaken.length === 1 && this.state.previousToken === gem) {
			if (!this.canTakeTwoTokens(gem)) {
				return;
			}
		} else if (!this.canTakeToken(gem)) {
			return;
		}

		const tokensTaken = [...this.state.tokensTaken, gem];
		const tempState = {
			tokens: {},
			previousToken: gem,
			tokensTaken: tokensTaken
		};

		for (let currentGem in this.state.tokens) {
			if (gem === currentGem) {
				tempState.tokens[gem] = this.state.tokens[gem] - 1;
			} else {
				tempState.tokens[currentGem] = this.state.tokens[currentGem];
			}
		}
		socket.emit("get token", gem);
		this.setState(tempState);
	}

	renderToken(gem) {
		return (
			<Token
				key={gem}
				gem={gem}
				remaining={this.state.tokens[gem]}
				onClick={(e) => this.handleClick(e, gem)}
			/>
		);
	}

	renderStacks() {
		const tokens = [];
		const names = ["diamonds", "sapphires", "emeralds", "rubies", "onyx", "gold"];

		for (let gem of names) {
			tokens.push(this.renderToken(gem));
		}

		return tokens;
	}

	render() {
		const stacks = this.renderStacks();
		const hand = this.state.tokensTaken.map((token, i) =>
			<li key={i}>{token}</li>
		);
		return (
			<div>
				<ul>
					{stacks}
				</ul>
				<button onClick={this.discardHand.bind(this)}>Reset Hand</button>
				<button onClick={this.resetTokens.bind(this)}>Reset Tokens</button>
				<h4>Tokens in hand:</h4>
				<ol>
					{hand}
				</ol>
			</div>
		);
	}
}