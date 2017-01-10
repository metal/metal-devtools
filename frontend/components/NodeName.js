import Component, {Config} from 'metal-jsx';

export const OPENING = 0;
export const NORMAL_CLOSING = 1;
export const SELF_CLOSING = 2;

class NodeName extends Component {
	render() {
		const {name, type} = this.props;

		return (
			<span class="node-name-container">
				{type === NORMAL_CLOSING ? '</' : '<'}

				<span class="name">{name}</span>

				{type === SELF_CLOSING ? ' />' : '>'}
			</span>
		);
	}
}

NodeName.PROPS = {
	name: Config.string(),
	type: Config.oneOf([OPENING, NORMAL_CLOSING, SELF_CLOSING]).value(OPENING)
};

export default NodeName;
