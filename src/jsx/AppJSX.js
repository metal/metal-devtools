import Component, {Config} from 'metal-jsx';

class App extends Component {
	addChild() {
		this.state.numOfChildren += 1;
	}

	render() {
		const children = Array(this.state.numOfChildren).fill();

		return (
			<div>
				{'Go to:'}<a href="/metal-devtools/soy.html">{'Soy example'}</a>

				<h1>{'JSX example'}</h1>
				<button onClick="addChild">{'Add a child!'}</button>

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

App.STATE = {
	numOfChildren: Config.value(1)
};

class Child extends Component {
	render() {
		return (
			<div>
				{`I'm child #${this.props.index}.`}
			</div>
		);
	}
}

Child.PROPS = {
	index: Config.number()
};

window.jsxApp = App;
