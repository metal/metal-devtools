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
		expect(cloneObj(() => {})).toMatchSnapshot();
	});

	test('should copy named function', () => {
		function fooFn() {};

		expect(cloneObj(fooFn)).toMatchSnapshot();
	});

	test('should copy array', () => {
		expect(cloneObj([])).toBeInstanceOf(Array);
	});

	test('should copy Date', () => {
		expect(cloneObj(new Date())).toBeInstanceOf(Date);
	});

	test('should use constructor name', () => {
		const date = new Date();

		function mockConstructor() {
			throw Error();
		}

		date.constructor = mockConstructor;

		expect(cloneObj(date)).toEqual('mockConstructor');
	});

	test('should copy immutable type to be plain js', () => {
		expect(cloneObj(List())).toBeInstanceOf(Array);
		expect(cloneObj(Map())).toBeInstanceOf(Object);
	});

	test('should copy jsx type to be function string', () => {
		expect(cloneObj(<div></div>)).toMatchSnapshot();
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

	test('should not follow circular references', () => {
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
