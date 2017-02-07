import RootManagerClass from './lib/RootManager';

const hook = () => {
	const {__METAL_DEV_TOOLS_HOOK__} = window;

	if (__METAL_DEV_TOOLS_HOOK__) {
		const RootManager = new RootManagerClass();

		window.__METAL_DEV_TOOLS_HOOK__.getAll().forEach(
			root => RootManager.addRoot(root)
		);

		window.__METAL_DEV_TOOLS_HOOK__ = (component) => RootManager.addRoot(component);

		window.__METAL_DEV_TOOLS_HOOK__.getComponentNode = RootManager.getComponentNode.bind(RootManager);
		window.__METAL_DEV_TOOLS_HOOK__.hasComponent = RootManager.hasComponent.bind(RootManager);
		window.__METAL_DEV_TOOLS_HOOK__.hasRoots = RootManager.hasRoots.bind(RootManager);
		window.__METAL_DEV_TOOLS_HOOK__.highlightNode = RootManager.highlightNode.bind(RootManager);
		window.__METAL_DEV_TOOLS_HOOK__.selectComponent = RootManager.selectComponent.bind(RootManager);

		RootManager.loadRoots();
	}
};

hook();

export default hook;
