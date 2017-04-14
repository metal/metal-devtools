import Component from 'metal-jsx'; // eslint-disable-line
import {Iterable, fromJS} from 'immutable';
import {isBoolean, isNull, isObject} from 'lodash';

export default function(value) {
	let retVal = value;

	if (isObject(value)) {
		if (Iterable.isIterable(value)) {
			value = fromJS(value);
		}

		retVal = [<pre>{JSON.stringify(value, null, 2)}</pre>];
	} else if (isBoolean(value)) {
		retVal = value.toString();
	} else if (value === '') {
		retVal = '""';
	} else if (isNull(value)) {
		retVal = 'null';
	}

	return retVal;
}
