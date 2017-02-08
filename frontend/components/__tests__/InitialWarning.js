jest.unmock('../InitialWarning');

import InitialWarning from '../InitialWarning';

describe('InitialWarning', () => {
	test('should render', () => {
		const component = new InitialWarning();

		expect(snap(component)).toMatchSnapshot();
	});
});
