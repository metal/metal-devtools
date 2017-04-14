jest.unmock('../cloneObj');

import Component from 'metal-jsx'; // eslint-disable-line
import {List, Map} from 'immutable';

import cloneObj, {ITERABLE_KEY} from '../cloneObj';

describe('cloneObj', () => {
	test('should return item if not an object', () => {
		expect(cloneObj(true)).toMatchSnapshot();
		expect(cloneObj(123)).toMatchSnapshot();
		expect(cloneObj('foo')).toMatchSnapshot();
	});

	test('should copy anonymous function', () => {
		expect(cloneObj(() => {})).toMatchSnapshot();
	});

	test('should copy named function', () => {
		function fooFn() {}

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

		expect(cloneObj(date)).toMatchSnapshot();
	});

	test('should copy immutable type to be plain js', () => {
		expect(cloneObj(List())).toBeInstanceOf(Array);
		expect(cloneObj(Map())).toBeInstanceOf(Object);
	});

	test('should copy jsx type to be function string', () => {
		expect(cloneObj(<div />)).toMatchSnapshot();
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

		expect(cloneObj(objA)).toMatchSnapshot();
	});

	test('should follow redundant-acyclic references', () => {
		const objD = {name: 'leaf'};
		const objB = {ref: objD};
		const objC = {ref: objD};
		const objA = {left: objB, right: objC};

		expect(cloneObj(objA)).toMatchSnapshot();
	});
});
