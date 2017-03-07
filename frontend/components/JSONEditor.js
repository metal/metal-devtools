import Component, {Config} from 'metal-jsx';
import JSONEditor from 'jsoneditor';
import {debounce, isEqual, keys} from 'lodash';

class MetalJSONEditor extends Component {
	created() {
		this.handleChange = debounce(this.handleChange.bind(this), 350);
	}

	attached() {
		const {config, type, value} = this.props;

		this._editor = new JSONEditor(
			this.element,
			{
				history: false,
				mode: 'form',
				...config,
				name: type,
				onChange: this.handleChange
			}
		);

		this._editor.set(value);
	}

	getChangedData() {
		const {value} = this.props;

		const newValue = this.getData();

		let changedData = {};

		keys(value).forEach(
			key => {
				const keyVal = value[key];
				const newKeyValue = newValue[key];

				if (!isEqual(keyVal, newKeyValue)) {
					changedData[key] = newKeyValue;
				}
			}
		);

		return changedData;
	}

	getData() {
		return this._editor.get();
	}

	getEditor() {
		return this._editor;
	}

	handleChange() {
		const {onChange, type} = this.props;

		onChange(this.getChangedData(), type);
	}

	shouldUpdate() {
		return false;
	}

	syncValue(newVal) {
		if (this._editor) {
			this._editor.set(newVal);
		}
	}
}

MetalJSONEditor.PROPS = {
	config: Config.object(),
	onChange: Config.func(),
	type: Config.string(),
	value: Config.object()
};

export default MetalJSONEditor;
