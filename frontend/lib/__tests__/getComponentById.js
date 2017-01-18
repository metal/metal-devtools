jest.unmock('../getComponentById');

import getComponentById from '../getComponentById';

const COMPONENTS_ARR = [
	{
		id: 1,
		childComponents: [
			{
				id: 3,
				childComponents: [
					{
						id: 6,
						childComponents: []
					}
				]
			},
			{
				id: 4,
				childComponents: []
			}
		]
	},
	{
		id: 2,
		childComponents: [
			{
				id: 5,
				childComponents: []
			}
		]
	}
];

describe('getComponentById', () => {
	it('should return component for each id', () => {
		expect(getComponentById(COMPONENTS_ARR, 1).id).toBe(1);
		expect(getComponentById(COMPONENTS_ARR, 2).id).toBe(2);
		expect(getComponentById(COMPONENTS_ARR, 3).id).toBe(3);
		expect(getComponentById(COMPONENTS_ARR, 4).id).toBe(4);
		expect(getComponentById(COMPONENTS_ARR, 5).id).toBe(5);
		expect(getComponentById(COMPONENTS_ARR, 6).id).toBe(6);
	});
});
