jest.unmock('../otherProps');

import Component from 'metal-jsx';

import otherProps from '../otherProps';

describe(
	'otherProps',
	() => {
		it(
			'should return all config props not declared in STATE',
			() => {
				class TestComponent extends Component {
					render() {
						return null;
					}
				}

				TestComponent.STATE = {
					bar: {},
					foo: {}
				};

				const component = new TestComponent(
					{
						baz: 1,
						test: 2
					}
				);

				const other = otherProps(component);

				expect(other.foo).toBeUndefined();
				expect(other.bar).toBeUndefined();

				expect(other.baz).toBe(1);
				expect(other.test).toBe(2);
			}
		);

		it(
			'should ignore children',
			() => {
				class TestComponent extends Component {
					render() {
						return null;
					}
				}

				const component = new TestComponent(
					{
						children: 'test'
					}
				);

				const other = otherProps(component);

				expect(other.children).toBeUndefined();
			}
		);
	}
);
