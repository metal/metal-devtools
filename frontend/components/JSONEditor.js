import Component, {Config} from 'metal-jsx';
import JSONEditor from 'jsoneditor';

class MetalJSONEditor extends Component {
	created() {
		this.handleChange = this.handleChange.bind(this);
	}

	attached() {
		const {config, value} = this.props;

		this._editor = new JSONEditor(
			this.refs.editor,
			{
				history: false,
				mode: 'view',
				...config,
				onChange: this.handleChange
			}
		);

		this._editor.set(value);
	}

	handleChange() {
		this.props.onChange(this._editor.get(), this.props.type);
	}

	getEditor() {
		return this._editor;
	}

	getData() {
		return this._editor.get();
	}

	syncValue(newVal) {
		if (this._editor) {
			this._editor.set(newVal);
		}
	}

	shouldUpdate() {
		return false;
	}

	render() {
		return (
			<div>
				<div ref="editor"></div>
			</div>
		);
	}
}

MetalJSONEditor.PROPS = {
	config: Config.object(),
	onChange: Config.func(),
	type: Config.string(),
	value: Config.object()
};

export default MetalJSONEditor;
