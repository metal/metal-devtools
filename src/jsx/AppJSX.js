import Component, {Config} from 'metal-jsx';

class App extends Component {
	render() {
		return (
			<div>
				{'Go to:'}<a href="/metal-devtools/soy.html">{'Soy example'}</a>

				<h1>{'JSX example'}</h1>
				<Parent />
			</div>
		);
	}
}

class Parent extends Component {
	addChild() {
		this.state.numOfChildren += 1;
	}

	randomColor() {
		this.state.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
	}

	render() {
		const children = Array(this.state.numOfChildren).fill();

		return (
			<div style={`padding-left: 16px;background-color:${this.state.backgroundColor};`}>
				{'Parent:'}
				<button onClick={this.addChild.bind(this)}>{'Add a child!'}</button>
				<button onClick={this.randomColor.bind(this)}>{'color!'}</button>

				{
					children.map(
						(child, i) => (
							<Child index={i} key={i} />
						)
					)
				}
			</div>
		);
	}
}

Parent.STATE = {
	backgroundColor: Config.value('inherit'),
	numOfChildren: Config.value(1)
};

class Child extends Component {
	handleClick() {
		this.state.subTree = true;
	}

	randomColor() {
		this.state.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
	}

	render() {
		return (
			<div style={`padding-left: 32px;background-color:${this.state.backgroundColor};`}>
				{`Child #${this.props.index}:`}

				<button onClick={this.handleClick.bind(this)}>{'+'}</button>
				<button onClick={this.randomColor.bind(this)}>{'color!'}</button>

				{this.state.subTree &&
					<div>
						<Parent />
					</div>
				}
			</div>
		);
	}
}

Child.PROPS = {
	index: Config.number()
};

Child.STATE = {
	backgroundColor: Config.value('inherit'),
	subTree: Config.bool().value(false)
};

window.jsxApp = App;
