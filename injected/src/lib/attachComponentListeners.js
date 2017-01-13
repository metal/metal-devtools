export const __METAL_DEV_TOOLS_COMPONENT_KEY__ = '__METAL_DEV_TOOLS_COMPONENT_KEY__';

let componentId = 0;
let updateScheduled = {};

export default (component, rootComponent, callback) => {
	if (!component[__METAL_DEV_TOOLS_COMPONENT_KEY__]) {
		const currentId = `${__METAL_DEV_TOOLS_COMPONENT_KEY__}${componentId++}`;

		component[__METAL_DEV_TOOLS_COMPONENT_KEY__] = currentId;

		const rootId = rootComponent[__METAL_DEV_TOOLS_COMPONENT_KEY__];

		component.on(
			'rendered',
			() => {
				if (!updateScheduled[rootId]) {
					updateScheduled[rootId] = true;

					setTimeout(
						() => {
							window.postMessage(
								callback(rootComponent, rootComponent),
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
						id: currentId,
						remove: true
					},
					'*'
				);

				if (rootId === currentId) {
					window.__METAL_DEV_TOOLS_HOOK__.removeRoot(rootComponent);
				}
			}
		);
	}
};
