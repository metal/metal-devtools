import RootManagerClass from './lib/RootManager';

const hook = () => {
	const {__METAL_DEV_TOOLS_HOOK__} = window;

	if (__METAL_DEV_TOOLS_HOOK__) {
		if (__METAL_DEV_TOOLS_HOOK__._managerExists) {
			__METAL_DEV_TOOLS_HOOK__.reloadRoots(true);
		} else {
			const RootManager = new RootManagerClass();

			__METAL_DEV_TOOLS_HOOK__
				.getAll()
				.forEach(root => RootManager.addRoot(root));

			window.__METAL_DEV_TOOLS_HOOK__ = component =>
				RootManager.addRoot(component);

			window.__METAL_DEV_TOOLS_HOOK__._managerExists = true;

			window.__METAL_DEV_TOOLS_HOOK__.getComponentNode = RootManager.getComponentNode.bind(
				RootManager
			);
			window.__METAL_DEV_TOOLS_HOOK__.hasComponent = RootManager.hasComponent.bind(
				RootManager
			);
			window.__METAL_DEV_TOOLS_HOOK__.hasRoots = RootManager.hasRoots.bind(
				RootManager
			);
			window.__METAL_DEV_TOOLS_HOOK__.highlightNode = RootManager.highlightNode.bind(
				RootManager
			);
			window.__METAL_DEV_TOOLS_HOOK__.reloadRoots = RootManager.reloadRoots.bind(
				RootManager
			);
			window.__METAL_DEV_TOOLS_HOOK__.selectComponent = RootManager.selectComponent.bind(
				RootManager
			);
			window.__METAL_DEV_TOOLS_HOOK__.setComponentState = RootManager.setComponentState.bind(
				RootManager
			);
			window.__METAL_DEV_TOOLS_HOOK__.setInspected = RootManager.setInspected.bind(
				RootManager
			);
		}
	}
};

hook();

export default hook;
