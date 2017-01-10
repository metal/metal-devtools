jest.unmock('../StatePane');
jest.unmock('../../lib/processStateValues');
jest.unmock('../../lib/getComponentById');

import StatePane from '../StatePane';

describe('StatePane', () => {
	it('should render', () => {
		const component = new StatePane();

		expect(component.element).toBeTruthy();
	});
});
