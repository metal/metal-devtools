import Component, {Config} from 'metal-jsx';

import processStateValue from '../lib/processStateValues';
import {debounce, isEqual} from 'lodash';

class FlashItem extends Component {
	created() {
		this.removeFlash = debounce(this.removeFlash, 100);

		this._firstRender = true;
	}

	removeFlash() {
		setTimeout(
			() => {
				this.element.classList.remove('flash');
			},
			100
		);
	}

	addFlash() {
		this.element.classList.add('flash');

		this.removeFlash();
	}

	syncValue(newVal, oldVal) {
		if (!this._firstRender && !isEqual(newVal, oldVal)) {
			this.addFlash();
		}
		else if (this._firstRender) {
			this._firstRender = false;
		}
	}

	render() {
		return (
			<span>{processStateValue(this.props.value)}</span>
		);
	}
}

FlashItem.PROPS = {
	value: Config.any()
};

export default FlashItem;
