const Targetables = require('../TargetableSet');
const { mockBuildBus } = require('../../../TestHelpers/testTargets');

describe('TargetableSet is a target helper library', () => {
    let targetable;
    let bus;
    let builtins;
    beforeEach(done => {
        bus = mockBuildBus({
            context: __dirname,
            dependencies: [
                {
                    name: '@magento/fakedep',
                    declare(targets) {
                        targets.declare({
                            fakeTarget: new targets.types.Sync(['x'])
                        });
                    },
                    intercept(targets) {
                        targetable = Targetables.using(targets);
                        builtins = bus.getTargetsOf('@magento/pwa-buildpack');
                        done();
                    }
                }
            ]
        });
        bus.init();
    });
    it('requires a TargetProvider', () => {
        expect(() => Targetables.using({})).toThrowErrorMatchingSnapshot();
    });
    describe('with factory methods for creating Targetables:', () => {
        it('with a string module path as first argument, or a config object with a "module" property as first argument', () => {
            expect(
                targetable.module({
                    module: '@magento/fakedep/module1'
                })
            ).toBeInstanceOf(Targetables.Module);
            expect(
                targetable.esModule('@magento/fakedep/esModule1')
            ).toBeInstanceOf(Targetables.ESModule);
        });
        it('of all types', () => {
            expect(
                targetable.esModuleArray('@magento/fakedep/esModuleArray1')
            ).toBeInstanceOf(Targetables.ESModuleArray);
            expect(
                targetable.esModuleObject('@magento/fakedep/esModuleObject1')
            ).toBeInstanceOf(Targetables.ESModuleObject);
            expect(
                targetable.reactComponent('@magento/fakedep/reactComponent1')
            ).toBeInstanceOf(Targetables.ReactComponent);
        });
        it('caches and polymorphically reuses only one module of one type per file', () => {
            const file = '@magento/fakedep/esModule1';
            const esModule1 = targetable.esModule(file);
            expect(targetable.esModule(file)).toBe(esModule1);
            expect(targetable.module(file)).toBe(esModule1);
            expect(() =>
                targetable.reactComponent(file)
            ).toThrowErrorMatchingSnapshot();
        });
        describe('automatically intercepts transformModules and sends its requests, running a "publish" method first if it is supplied', () => {
            const collectRequests = async () => {
                const transformRequests = [];
                await builtins.transformModules.promise(x =>
                    transformRequests.push(x)
                );
                return transformRequests;
            };
            // Jest mocks might have overridden `.call` methods so we wrap the
            // mock in a normal function
            const mockPublish = jest.fn();
            const publish = (...args) => mockPublish(...args);
            beforeEach(() => {
                mockPublish.mockReset();
            });
            it('as a second arg callback', async () => {
                targetable.esModule('@magento/fake-dep/esModule1', publish);
                await collectRequests();
                expect(mockPublish).toHaveBeenCalledTimes(1);
            });
            it('as a method on the config object', async () => {
                targetable.esModule({
                    module: '@magento/fake-dep/esModule2',
                    publish
                });
                await collectRequests();
                expect(mockPublish).toHaveBeenCalledTimes(1);
            });
            it('as a method on an optional options object', async () => {
                targetable.esModule('@magento/fake-dep/esModule3', { publish });
                await collectRequests();
                expect(mockPublish).toHaveBeenCalledTimes(1);
            });
            it('runs the publisher and then adds the transforms of the connected module', async () => {
                const component = targetable.reactComponent(
                    '@magento/fake-dep/component',
                    publish
                );
                const arrayModule = targetable.esModuleArray(
                    '@magento/fake-dep/someArray',
                    publish
                );
                const noPublishMethod = targetable.esModule(
                    '@magento/fake-dep/something-else'
                );
                jest.spyOn(noPublishMethod, 'flush');
                component.appendJSX('form', '<input />');
                component.addReactLazyImport('path/to/module');
                arrayModule.push('import something from "somewhere"');
                await expect(collectRequests()).resolves.toMatchSnapshot();
                expect(noPublishMethod.flush).toHaveBeenCalled();
                expect(mockPublish).toHaveBeenCalledTimes(2);
                const [firstCall, secondCall] = mockPublish.mock.calls;
                expect(firstCall[0]).toHaveProperty('fakeTarget');
                expect(firstCall[1]).toBe(component);
                expect(secondCall[0]).toBe(firstCall[0]);
                expect(secondCall[1]).toBe(arrayModule);
            });
        });
    });
    describe('with convenience functions for common built-in target operations:', () => {
        describe('setSpecialFeatures handles the builtins.specialFeatures target', () => {
            const featuresTargetResult = () => {
                const features = {};
                builtins.specialFeatures.call(features);
                return features['@magento/fakedep'];
            };
            it('can take flag names as arguments, sets them to true', () => {
                targetable.setSpecialFeatures('graphqlQueries', 'upward');
                expect(featuresTargetResult()).toMatchObject({
                    graphqlQueries: true,
                    upward: true
                });
            });
            it('can take an array of flag names as an argument', () => {
                targetable.setSpecialFeatures([
                    'rootComponents',
                    'cssModules',
                    'i18n'
                ]);
                expect(featuresTargetResult()).toMatchObject({
                    rootComponents: true,
                    cssModules: true,
                    i18n: true
                });
            });
            it('can take an object with boolean flags, or any of those things', () => {
                targetable.setSpecialFeatures(
                    {
                        setWithFlagObject: true,
                        unsetWithFlagObject: false
                    },
                    'setWithArg',
                    ['setWithArray', 'setWithArray2'],
                    'setWithArg2'
                );
                expect(featuresTargetResult()).toMatchObject({
                    setWithFlagObject: true,
                    unsetWithFlagObject: false,
                    setWithArg: true,
                    setWithArray: true,
                    setWithArray2: true,
                    setWithArg2: true
                });
            });
        });
        describe('defineEnvVars handles the boilerplate of tapping builtins.envVarDefinitions', () => {
            const defsTargetResult = () => {
                const envVarDefs = {
                    sections: [
                        {
                            name: 'Existing section',
                            variables: [
                                {
                                    name: 'EXISTING_VAR'
                                }
                            ]
                        }
                    ]
                };
                builtins.envVarDefinitions.call(envVarDefs);
                return envVarDefs;
            };
            it('can add to existing sections by name', () => {
                targetable.defineEnvVars('Existing section', [
                    {
                        name: 'NEW_VAR_1',
                        type: 'str'
                    },
                    {
                        name: 'NEW_VAR_2'
                    }
                ]);
                const { sections } = defsTargetResult();
                expect(sections).toHaveLength(1);
                expect(sections[0].variables).toHaveLength(3);
                expect(sections[0].variables).toMatchObject([
                    { name: 'EXISTING_VAR' },
                    { name: 'NEW_VAR_1', type: 'str' },
                    { name: 'NEW_VAR_2' }
                ]);
            });
            it('can create new sections', () => {
                targetable.defineEnvVars('New section', [
                    {
                        name: 'NEW_SECTION_VAR'
                    }
                ]);
                const { sections } = defsTargetResult();
                expect(sections).toHaveLength(2);
                expect(sections[0].name).toBe('Existing section');
                expect(sections[1].name).toBe('New section');
                expect(sections[1].variables[0].name).toBe('NEW_SECTION_VAR');
            });
        });
    });
});
