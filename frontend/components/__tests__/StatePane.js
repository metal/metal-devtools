jest.unmock('../../lib/getComponentById');
jest.unmock('../../lib/processStateValues');
jest.unmock('../NodeName');
jest.unmock('../ResizeDivider');
jest.unmock('../StatePane');
jest.unmock('../FlashStateValue');

import StatePane from '../StatePane';

describe('StatePane', () => {
	it('should render', () => {
		const component = new StatePane();

		expect(snap(component)).toMatchSnapshot();
	});
});
