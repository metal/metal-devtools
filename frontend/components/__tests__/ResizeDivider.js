jest.unmock('../ResizeDivider');

import ResizeDivider from '../ResizeDivider';

describe('ResizeDivider', () => {
	it('should render', () => {
		const component = new ResizeDivider({onResize: jest.fn()});

		expect(snap(component)).toMatchSnapshot();
	});
});
