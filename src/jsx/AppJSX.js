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

	render() {
		const children = Array(this.state.numOfChildren).fill();

		return (
			<div style="padding-left: 16px;">
				{'Parent:'}<button onClick={this.addChild.bind(this)}>{'Add a child!'}</button>

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
	numOfChildren: Config.value(1)
};

class Child extends Component {
	handleClick() {
		this.state.subTree = true;
	}

	render() {
		return (
			<div style="padding-left:32px">
				{`Child #${this.props.index}:`}

				<button onClick={this.handleClick.bind(this)}>{'+'}</button>

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
	subTree: Config.bool().value(false)
};

window.jsxApp = App;
