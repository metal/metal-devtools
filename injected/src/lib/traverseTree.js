import processDataManagers from './processDataManagers';
import attachComponentListeners, {__METAL_DEV_TOOLS_COMPONENT_KEY__} from './attachComponentListeners';

const traverseTree = (component, rootComponent) => {
	if (!component) {
		return {};
	}

	attachComponentListeners(component, rootComponent, traverseTree);

	const renderer = component.__METAL_IC_RENDERER_DATA__;

	return {
		data: processDataManagers(component.__DATA_MANAGER_DATA__),
		id: component[__METAL_DEV_TOOLS_COMPONENT_KEY__],
		name: component.name || component.constructor.name,
		childComponents: renderer && renderer.childComponents && renderer.childComponents.map(
			childComponent => traverseTree(childComponent, rootComponent)
		)
	};
};

export default traverseTree;
