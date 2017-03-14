import Component from 'metal-component';
import Soy from 'metal-soy';
import templates from './ParentSoy.soy';

class ParentSoy extends Component {
	addChild() {
		this.childrenArr = [...this.childrenArr, 0];

	}

	randomColor() {
		this.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
	}
}

ParentSoy.STATE = {
	backgroundColor: {
		internal: true,
		value: 'inherit'
	},
	childrenArr: {
		internal: true,
		value: [0]
	}
};

Soy.register(ParentSoy, templates);

export default ParentSoy;
