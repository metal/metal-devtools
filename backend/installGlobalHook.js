export default window => {
	const {__METAL_DEV_TOOLS_HOOK__} = window;

	if (__METAL_DEV_TOOLS_HOOK__ && __METAL_DEV_TOOLS_HOOK__.rootComponents && __METAL_DEV_TOOLS_HOOK__.rootComponents.length) {
		function processConfig(stateInfo, keyBlackList = [], instanceBlackList = []) {
			let retVal = {};

			if (stateInfo) {
				const keys = Object.keys(stateInfo);

				keys.forEach(
					key => {
						const {value} = stateInfo[key];

						if (keyBlackList.indexOf(key) === -1 && !instanceBlackList.some(type => value instanceof type)) {
							retVal[key] = value;
						}
					}
				);
			}

			try {
				retVal = JSON.stringify(retVal);
			} catch (e) {
				retVal = 'null';
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

									updateScheduled[rootId] = false;
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

			const dataManagerData = component.__DATA_MANAGER_DATA__;

			const dataManagerKeys = Object.keys(dataManagerData);

			let data = {};

			dataManagerKeys.forEach(
				key => {
					const dataManager = dataManagerData[key];

					data[key.replace('_', '')] = processConfig(
						dataManager.stateInfo_,
						['children', 'childrenMap_', 'events', 'storeState'],
						[HTMLElement]
					);
				}
			);

			const renderer = component.__METAL_IC_RENDERER_DATA__;

			return {
				data,
				id: component[__METAL_DEV_TOOLS_COMPONENT_KEY__],
				name: component.name || component.constructor.name,
				childComponents: renderer.childComponents && renderer.childComponents.map(
					childComponent => climbTree(childComponent, rootComponent)
				)
			};
		}

		__METAL_DEV_TOOLS_HOOK__.rootComponents.forEach(
			component => {
				window.postMessage(
					climbTree(component, component),
					'*'
				);
			}
		);
	}
};
