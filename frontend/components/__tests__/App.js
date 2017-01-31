jest.disableAutomock();

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

			component.processMessage({data: {}, type: 'detached'});

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

			component.processMessage({data: {}, type: 'update'});

			expect(spy).toBeCalled();
		});

		it('should call `selectedChange`', () => {
			const component = new App({
				port: {
					onMessage: {
						addListener: jest.fn()
					}
				}
			});

			const spy = jest.fn();

			component.selectedChange = spy;

			component.processMessage({data: {}, type: 'selected'});

			expect(spy).toBeCalled();
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

			component.processMessage({data: {}, type: 'newRoot'});

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

			const spy = jest.fn();

			console.log = spy;

			component.processMessage({data: {}, type: 'bar'});

			expect(spy).toBeCalled();
		});
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

	it('should set selectedId', () => {
		const component = new App({
			port: {
				onMessage: {
					addListener: jest.fn()
				}
			}
		});

		component.state.selectedId = 'foo';

		component.selectedChange('bar');

		expect(component.state.selectedId).toEqual('bar');
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
});
