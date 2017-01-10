jest.unmock('../TreeNode');
jest.unmock('../NodeName');

import TreeNode from '../TreeNode';

describe('TreeNode', () => {
	it('should render', () => {
		const component = new TreeNode();

		expect(component.element).toBeTruthy();
	});
});
