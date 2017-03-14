import Component from 'metal-component';
import Soy from 'metal-soy';
import templates from './ChildSoy.soy';

class ChildSoy extends Component {
	handleClick() {
		this.subTree = true;
	}

	randomColor() {
		this.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
	}
};

ChildSoy.STATE = {
	backgroundColor: {
		internal: true,
		value: 'inherit'
	},
	subTree: {
		internal: true,
		value: false
	}
};

Soy.register(ChildSoy, templates);

export default ChildSoy;
