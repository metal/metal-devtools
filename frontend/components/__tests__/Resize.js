jest.unmock('../Resize');

import Resize from '../Resize';

describe('Resize', () => {
	it('should render', () => {
		const component = new Resize({onResize: jest.fn()});

		expect(snap(component)).toMatchSnapshot();
	});
});
