import Component from 'metal-component';
import Soy from 'metal-soy';
import templates from './ParentSoy.soy';

class ParentSoy extends Component {
	addChild() {
		this.childrenArr = [...this.childrenArr, 0];

	}
}

ParentSoy.STATE = {
	childrenArr: {
		value: [0]
	}
};

Soy.register(ParentSoy, templates);

export default ParentSoy;
