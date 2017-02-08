jest.unmock('../NodeName');

import NodeName, {OPENING, NORMAL_CLOSING, SELF_CLOSING} from '../NodeName';

describe('NodeName', () => {
	test('should render with OPENING', () => {
		const component = new NodeName({type: OPENING});

		expect(snap(component)).toMatchSnapshot();
	});

	test('should render with NORMAL_CLOSING', () => {
		const component = new NodeName({type: NORMAL_CLOSING});

		expect(snap(component)).toMatchSnapshot();
	});

	test('should render with SELF_CLOSING', () => {
		const component = new NodeName({type: SELF_CLOSING});

		expect(snap(component)).toMatchSnapshot();
	});
});
