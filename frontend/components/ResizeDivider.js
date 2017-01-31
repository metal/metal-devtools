import Component, {Config} from 'metal-jsx';
import {bindAll} from 'lodash';

class ResizeDivider extends Component {
	created() {
		bindAll(
			this,
			'doDrag',
			'initDrag',
			'stopDrag'
		);
	}

	attached() {
		this.on('mousedown', this.initDrag);
	}

	doDrag({clientX}) {
		this.props.onResize({clientX});
	}

	initDrag() {
		document.body.addEventListener('mousemove', this.doDrag, false);
		document.body.addEventListener( 'mouseup', this.stopDrag, false);
	}

	stopDrag() {
		document.body.removeEventListener('mousemove', this.doDrag, false);
		document.body.removeEventListener('mouseup', this.stopDrag, false);
	}

	render() {
		return (
			<div class="resize-container" />
		);
	}
}

ResizeDivider.PROPS = {
	onResize: Config.func().required()
};

export default ResizeDivider;
