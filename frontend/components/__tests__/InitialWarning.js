jest.unmock('../InitialWarning');

import InitialWarning from '../InitialWarning';

describe('InitialWarning', () => {
	it('should render', () => {
		const component = new InitialWarning();

		expect(component.element).toBeTruthy();
	});
});
