import Component from 'metal-component';
import Soy from 'metal-soy';
import templates from './ParentSoy.soy';

class ParentSOY extends Component {
	addChild() {
		this.childrenArr = [...this.childrenArr, 0];

	}
}

ParentSOY.STATE = {
	childrenArr: {
		value: [0]
	}
};

Soy.register(ParentSOY, templates);

export default ParentSOY;
