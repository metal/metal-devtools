jest.unmock('../FlashStateValue');
jest.unmock('../../lib/processStateValues');

import FlashStateValue from '../FlashStateValue';

describe('FlashStateValue', () => {
	it('should render', () => {
		const component = new FlashStateValue();

		expect(snap(component)).toMatchSnapshot();
	});
});
