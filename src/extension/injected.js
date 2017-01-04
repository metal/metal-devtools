const hook = window => {
	const __METAL_DEV_TOOLS_COMPONENT_KEY__ = '__METAL_DEV_TOOLS_COMPONENT_KEY__';

	function removeComponent(component) {
		return () => {
			window.postMessage(
				{
					id: component[__METAL_DEV_TOOLS_COMPONENT_KEY__],
					remove: true
				},
				'*'
			);
		};
	}

	let componentId = 0;

	function climbTree(component, rootComponent) {
		if (!component) {
			return {};
		}

		if (!component[__METAL_DEV_TOOLS_COMPONENT_KEY__]) {
			component[__METAL_DEV_TOOLS_COMPONENT_KEY__] = `__METAL_DEV_TOOLS_COMPONENT_KEY__${componentId++}`;

			component.on(
				'rendered',
				() => {
					window.postMessage(
						climbTree(rootComponent, rootComponent),
						'*'
					);
				}
			);

			component.on('detached', removeComponent(component));
		}

		return {
			// state: component.getState && component.getState() || {},
			// props: component.props || {},
			id: component[__METAL_DEV_TOOLS_COMPONENT_KEY__],
			name: component.name || component.constructor.name,
			childComponents: component.__METAL_IC_RENDERER_DATA__.childComponents && component.__METAL_IC_RENDERER_DATA__.childComponents.map(
				childComponent => climbTree(childComponent, rootComponent)
			)
		}
	}

	window.__METAL_DEV_TOOLS_HOOK__ = function(component) {
		climbTree(component, component);
	}
}

export default hook;
