import Component from 'metal-component';
import Soy from 'metal-soy';
import templates from './ChildSoy.soy';

class ChildSoy extends Component {
	handleClick() {
		this.subTree = true;
	}
};

ChildSoy.STATE = {
	subTree: {
		value: false
	}
};

Soy.register(ChildSoy, templates);

export default ChildSoy;
