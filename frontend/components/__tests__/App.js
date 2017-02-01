jest.disableAutomock();

import * as messageTypes from '../../../shared/messageTypes';
import App from '../App';

const fooRoot = {
	id: 'foo'
};


describe('App', () => {
	it('should render', () => {
		const component = new App({
			port: {
				onMessage: {
					addListener: jest.fn()
				}
			}
		});

		component.state.rootComponents = {foo: fooRoot};

		jest.runAllTimers();

		expect(snap(component)).toMatchSnapshot();
	});

	it('should add root to state', () => {
		const component = new App({
			port: {
				onMessage: {
					addListener: jest.fn()
				}
			}
		});

		expect(component.state.rootComponents).toEqual({});

		component.addRootComponent(fooRoot);
		expect(component.state.rootComponents).toEqual({foo: fooRoot});
	});

	it('should check id detached component is a root', () => {
		const component = new App({
			port: {
				onMessage: {
					addListener: jest.fn()
				}
			}
		});

		component.state.rootComponents = {foo: fooRoot};

		component.checkIfRootDetached('foo');
		expect(component.state.rootComponents).toEqual({});
	});

	it('should set column width', () => {
		const component = new App({
			port: {
				onMessage: {
					addListener: jest.fn()
				}
			}
		});

		component.handleResize({clientX: 100});

		expect(component.state.firstColumnWidth).toEqual(100);
	});

	describe('processMessage', () => {
		it('should call `checkIfRootDetached`', () => {
			const component = new App({
				port: {
					onMessage: {
						addListener: jest.fn()
					}
				}
			});

			const spy = jest.fn();

			component.checkIfRootDetached = spy;

			component.processMessage({data: {}, type: messageTypes.DETACHED});

			expect(spy).toBeCalled();
		});

		it('should call `updateRootComponent`', () => {
			const component = new App({
				port: {
					onMessage: {
						addListener: jest.fn()
					}
				}
			});

			const spy = jest.fn();

			component.updateRootComponent = spy;

			component.processMessage({data: {}, type: messageTypes.UPDATE});

			expect(spy).toBeCalled();
		});

		it('should set selectedComponent', () => {
			const component = new App({
				port: {
					onMessage: {
						addListener: jest.fn()
					}
				}
			});

			component.processMessage({data: fooRoot, type: messageTypes.SELECTED});

			expect(component.state.selectedComponent).toBe(fooRoot);
		});

		it('should call `addRootComponent`', () => {
			const component = new App({
				port: {
					onMessage: {
						addListener: jest.fn()
					}
				}
			});

			const spy = jest.fn();

			component.addRootComponent = spy;

			component.processMessage({data: {}, type: messageTypes.NEW_ROOT});

			expect(spy).toBeCalled();
		});

		it('should emit console.log', () => {
			const component = new App({
				port: {
					onMessage: {
						addListener: jest.fn()
					}
				}
			});

			const logVal = console.log;

			console.log = jest.fn();

			component.processMessage({data: {}, type: 'bar'});

			expect(console.log).toBeCalled();

			console.log = logVal;
		});
	});

	it('should emit console.log', () => {
		const component = new App({
			port: {
				onMessage: {
					addListener: jest.fn()
				}
			}
		});

		const spy = jest.fn();

		component.flashNode = spy;

		component.processMessage({data: {}, type: messageTypes.RENDERED});

		expect(spy).toBeCalled();
	});

	it('should reset rootComponents state', () => {
		const component = new App({
			port: {
				onMessage: {
					addListener: jest.fn()
				}
			}
		});

		component.state.rootComponents = {foo: 'bar'};

		component.resetRoots();

		expect(component.state.rootComponents).toEqual({});
	});

	it('should update component', () => {
		const component = new App({
			port: {
				onMessage: {
					addListener: jest.fn()
				}
			}
		});

		component.state.rootComponents = {foo: fooRoot};

		component.updateRootComponent({...fooRoot, name: 'fooRoot'});

		expect(component.state.rootComponents['foo'].name).toEqual('fooRoot');
	});

	it('should add/remove `flash` class', () => {
		const component = new App({
			port: {
				onMessage: {
					addListener: jest.fn()
				}
			}
		});

		component.addFlash(component.element);

		expect(component.element.classList).toContain('flash');

		component.removeFlash(component.element);

		expect(component.element.classList).not.toContain('flash');
	});

	it('should add/remove `flash` class', () => {
		const component = new App({
			element: document.getElementById('testComponent'),
			port: {
				onMessage: {
					addListener: jest.fn()
				}
			}
		});

		const initialStub = document.querySelector;

		document.querySelector = jest.fn(() => true);
		component.addFlash = jest.fn();
		component.removeFlash = jest.fn();

		component.flashNode(component.element);

		jest.runAllTimers();

		expect(component.addFlash).toBeCalled();
		expect(component.removeFlash).toBeCalled();

		document.querySelector = initialStub;
	});
});
