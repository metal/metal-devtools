jest.unmock('../../lib/getComponentById');
jest.unmock('../../lib/processStateValues');
jest.unmock('../NodeName');
jest.unmock('../Resize');
jest.unmock('../StatePane');

import StatePane from '../StatePane';

describe('StatePane', () => {
	it('should render', () => {
		const component = new StatePane();

		expect(snap(component)).toMatchSnapshot();
	});
});
