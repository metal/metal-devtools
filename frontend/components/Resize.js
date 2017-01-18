import Component, {Config} from 'metal-jsx';

class Resize extends Component {
	created() {
		this.doDrag = this.doDrag.bind(this);
		this.initDrag = this.initDrag.bind(this);
		this.stopDrag = this.stopDrag.bind(this);
	}

	attached() {
		this.element.addEventListener('mousedown', this.initDrag, false);
	}

	doDrag({clientX}) {
		this.props.onResize({clientX});
	}

	stopDrag() {
		document.body.removeEventListener('mousemove', this.doDrag, false);
		document.body.removeEventListener('mouseup', this.stopDrag, false);
	}

	initDrag() {
		document.body.addEventListener('mousemove', this.doDrag, false);
		document.body.addEventListener( 'mouseup', this.stopDrag, false);
	}

	render() {
		return (
			<div class="resize-container" />
		);
	}
}

Resize.PROPS = {
	onResize: Config.func().required()
};

export default Resize;
