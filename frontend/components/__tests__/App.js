jest.disableAutomock();

import App from '../App';

describe('App', () => {
	it('should render', () => {
		const component = new App({
			port: {
				onMessage: {
					addListener: jest.fn()
				}
			}
		});

		expect(component.element).toBeTruthy();
	});
});
