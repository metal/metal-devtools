jest.unmock('../processDataManagers');

import cloneObj from '../cloneObj';
import processDataManagers from '../processDataManagers';

const DATA_MANAGER = {
	props: {
		stateInfo_: {}
	},
	state: {
		stateInfo_: {}
	}
};

describe('processDataManagers', () => {
	afterEach(() => {
		if (jest.isMockFunction(cloneObj)) {
			cloneObj.mockClear();
			cloneObj.mockReset();
		}
	});

	test('should return parsed data object', () => {
		cloneObj.mockReturnValue({});

		expect(processDataManagers(DATA_MANAGER)).toMatchObject({
			props: {},
			state: {}
		});
	});

	test('should call `cloneObj` for each data manager', () => {
		processDataManagers(DATA_MANAGER);

		expect(cloneObj).toHaveBeenCalledTimes(2);
	});

	test('should throw error', () => {
		const initialLog = console.log;

		console.log = jest.fn();

		cloneObj.mockImplementation(() => {
			throw new Error();
		});

		processDataManagers(DATA_MANAGER);

		expect(console.log).toHaveBeenCalledTimes(2);

		console.log = initialLog;
	});
});
