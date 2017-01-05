export default window => {
	function processConfig(config, keyBlackList = [], instanceBlackList = []) {
		const retVal = {};

		if (config) {
			const keys = Object.keys(config);

			keys.forEach(
				key => {
					const value = config[key];

					if (keyBlackList.indexOf(key) === -1 && !instanceBlackList.some(type => value instanceof type)) {
						retVal[key] = value;
					}
				}
			);
		}

		return retVal;
	}

	const __METAL_DEV_TOOLS_COMPONENT_KEY__ = '__METAL_DEV_TOOLS_COMPONENT_KEY__';

	let componentId = 0;
	let updateScheduled = {};

	function climbTree(component, rootComponent) {
		if (!component) {
			return {};
		}

		if (!component[__METAL_DEV_TOOLS_COMPONENT_KEY__]) {
			component[__METAL_DEV_TOOLS_COMPONENT_KEY__] = `${__METAL_DEV_TOOLS_COMPONENT_KEY__}${componentId++}`;

			const rootId = rootComponent[__METAL_DEV_TOOLS_COMPONENT_KEY__];

			component.on(
				'rendered',
				() => {
					if (!updateScheduled[rootId]) {
						updateScheduled[rootId] = true;

						setTimeout(
							() => {
								window.postMessage(
									climbTree(rootComponent, rootComponent),
									'*'
								);

								updateScheduled[rootId] = false
							},
							0
						);
					}
				}
			);

			component.on(
				'detached',
				() => {
					window.postMessage(
						{
							id: component[__METAL_DEV_TOOLS_COMPONENT_KEY__],
							remove: true
						},
						'*'
					);
				}
			);
		}

		const renderer = component.__METAL_IC_RENDERER_DATA__;

		return {
			state: JSON.stringify(
				processConfig(
					component.state,
					['children', 'childrenMap_', 'events', 'storeState'],
					[HTMLElement]
				)
			),
			props: JSON.stringify(
				processConfig(
					component.props,
					['children', 'events'],
					[HTMLElement]
				)
			),
			id: component[__METAL_DEV_TOOLS_COMPONENT_KEY__],
			name: component.name || component.constructor.name,
			childComponents: renderer.childComponents && renderer.childComponents.map(
				childComponent => climbTree(childComponent, rootComponent)
			)
		}
	}

	window.__METAL_DEV_TOOLS_HOOK__ = function(component) {
		climbTree(component, component);
	}
}
