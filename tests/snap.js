var TYPE = '__METAL_COMPONENT__';

function snap(component) {
	return {
		html: component.element.outerHTML,
		name: component.constructor.name,
		type: TYPE
	};
}

module.exports = {
	snap: snap,
	TYPE: TYPE
};
