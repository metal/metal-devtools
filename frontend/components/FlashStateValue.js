import Component, {Config} from 'metal-jsx';

import processStateValue from '../lib/processStateValues';
import {debounce, isEqual} from 'lodash';

class FlashStateValue extends Component {
	created() {
		this.removeFlash = debounce(this.removeFlash, 100);

		this._firstRender = true;
	}

	addFlash() {
		this.element.classList.add('flash');

		this.removeFlash();
	}

	removeFlash() {
		setTimeout(() => {
			this.element.classList.remove('flash');
		}, 100);
	}

	syncValue(newVal, oldVal) {
		if (!this._firstRender && !isEqual(newVal, oldVal)) {
			this.addFlash();
		} else {
			this._firstRender = false;
		}
	}

	render() {
		return <span>{processStateValue(this.props.value)}</span>;
	}
}

FlashStateValue.PROPS = {
	value: Config.any()
};

export default FlashStateValue;
