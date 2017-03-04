jest.unmock('../cloneObj');

import Component from 'metal-jsx'; // eslint-disable-line
import {List, Map} from 'immutable';

import cloneObj, {ITERABLE_KEY} from '../cloneObj';

describe('cloneObj', () => {
	test('should return item if not an object', () => {
		const bool = true;
		const num = 123;
		const str = 'foo';

		expect(cloneObj(bool)).toEqual(bool);
		expect(cloneObj(num)).toEqual(num);
		expect(cloneObj(str)).toEqual(str);
	});

	test('should copy anonymous function', () => {
		expect(cloneObj(() => {})).toEqual('function()');
	});

	test('should copy named function', () => {
		function fooFn() {};

		expect(cloneObj(fooFn)).toEqual('function fooFn()');
	});

	test('should copy array', () => {
		expect(cloneObj([])).toBeInstanceOf(Array);
	});

	test('should copy Date', () => {
		expect(cloneObj(new Date())).toBeInstanceOf(Date);
	});

	test('should copy DOM node', () => {
		const node = {
			constructor: HTMLElement,
			tagName: 'DIV'
		};

		expect(cloneObj(node)).toEqual('<DIV />');
	});

	test('should copy immutable type to be plain js', () => {
		expect(cloneObj(List())).toBeInstanceOf(Array);
		expect(cloneObj(Map())).toBeInstanceOf(Object);
	});

	test('should copy jsx type to be function string', () => {
		expect(cloneObj(<div></div>)).toEqual('<JSXElement />');
	});

	test('should copy object', () => {
		expect(cloneObj({foo: 'bar'})).toBeInstanceOf(Object);
	});

	test('should copy nested object', () => {
		const nestedObj = {
			foo: {
				bar: 'baz'
			}
		};

		expect(cloneObj(nestedObj)).toBeInstanceOf(Object);
	});

	test('should copy RegExp', () => {
		expect(cloneObj(/test/)).toBeInstanceOf(RegExp);
	});

	test('should throw console.log on error', () => {
		const initialLog = console.log;

		console.log = jest.fn();

		cloneObj({
			[ITERABLE_KEY]: true,
			toJS: () => {
				throw new Error();
			}
		});

		expect(console.log).toHaveBeenCalledTimes(2);

		console.log = initialLog;
	});

	test.only('should not follow circular references', () => {
		const objA = {};
		const objB = {};
		const objC = {};
		objA.ref = objB;
		objB.ref = objC;
		objC.ref = objA;

		expect(cloneObj(objA)).toMatchObject(
			{
				ref: {
					ref: {
						ref: '[Circular]'
					}
				}
			}
		);
	});
});
