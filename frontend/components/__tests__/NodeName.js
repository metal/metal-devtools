jest.unmock('../NodeName');

import NodeName, {OPENING, NORMAL_CLOSING, SELF_CLOSING} from '../NodeName';

describe('NodeName', () => {
	it('should render with OPENING', () => {
		const component = new NodeName({type: OPENING});

		expect(component.element).toBeTruthy();
	});

	it('should render with NORMAL_CLOSING', () => {
		const component = new NodeName({type: NORMAL_CLOSING});

		expect(component.element).toBeTruthy();
	});

	it('should render with SELF_CLOSING', () => {
		const component = new NodeName({type: SELF_CLOSING});

		expect(component.element).toBeTruthy();
	});
});
