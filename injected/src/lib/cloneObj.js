export const ITERABLE_KEY = '@@__IMMUTABLE_ITERABLE__@@';

// Copied pattern from MDN, https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
function cloneObj(objectToBeCloned, visited = new Set()) {
	if (!(objectToBeCloned instanceof Object)) {
		return objectToBeCloned;
	}

	let objectClone;

	try {
		if (objectToBeCloned && objectToBeCloned[ITERABLE_KEY]) {
			objectToBeCloned = objectToBeCloned.toJS();
		}

		const Constructor = objectToBeCloned.constructor;

		switch (Constructor) {
			case RegExp:
				objectClone = new Constructor(objectToBeCloned);
				break;
			case Date:
				objectClone = new Constructor(objectToBeCloned.getTime());
				break;
			case HTMLElement:
				objectClone = `<${objectToBeCloned.tagName} />`;
				break;
			case Function:
				if (objectToBeCloned.name) {
					objectClone = `function ${objectToBeCloned.name}()`;
				}
				else if (objectToBeCloned.__jsxDOMWrapper) {
					objectClone = '<JSXElement />';
				}
				else {
					objectClone = 'function()';
				}
				break;
			default:
				objectClone = new Constructor();
		}
	} catch (err) {
		console.log('%c metal-devtools extension: (`clone`)\n', 'background: rgb(136, 18, 128); color: #DDD', err);
		console.log('%c Args:', 'background: rgb(136, 18, 128); color: #DDD', objectToBeCloned);
	}

	if (objectClone instanceof Object) {
		visited.add(objectToBeCloned);

		for (let key in objectToBeCloned) {
			const prop = objectToBeCloned[key];

			if (typeof prop !== 'undefined') {
				objectClone[key] = visited.has(prop) ? '[Circular]' : cloneObj(prop, visited);
			}
		}
	}

	return objectClone;
}

export default cloneObj;
