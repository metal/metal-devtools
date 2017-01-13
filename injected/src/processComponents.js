import traverseTree from './lib/traverseTree';

const {__METAL_DEV_TOOLS_HOOK__} = window;

if (__METAL_DEV_TOOLS_HOOK__) {
	const sendComponent = component => {
		window.postMessage(
			traverseTree(component, component),
			'*'
		);
	};

	if (__METAL_DEV_TOOLS_HOOK__.hasRoots()) {
		__METAL_DEV_TOOLS_HOOK__.getRoots().forEach(sendComponent);
	}

	__METAL_DEV_TOOLS_HOOK__.on('addRoot', sendComponent);
}
