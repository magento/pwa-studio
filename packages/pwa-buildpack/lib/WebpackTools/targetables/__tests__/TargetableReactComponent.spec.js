const TargetableReactComponent = require('../TargetableReactComponent');

const checkboxSource = `import { Component, lazy } from 'react';
export function Checkbox(props) {
    const { classes, fieldState, id, label, message, ...rest } = props;
    const { value: checked } = fieldState;
    const icon = checked ? checkedIcon : uncheckedIcon;

    return (
        <Fragment>
            <label className={classes.root} htmlFor={id}>
                <BasicCheckbox
                    {...rest}
                    className={classes.input}
                    fieldState={fieldState}
                    id={id}
                />
                <span className="literal-classname">{icon}</span>
                <span className={classes.label}>{label}</span>
            </label>
            <Status />
            <Message fieldState={fieldState}>{message}</Message>
            <Message fieldState={fieldState}>hey cool</Message>
        </Fragment>
    );
}
`;

const fileToTransform = '/path/to/Checkbox.js';
const CheckboxModule = new TargetableReactComponent(fileToTransform, () => {});
const latestTransform = () =>
    CheckboxModule._queuedTransforms[
        CheckboxModule._queuedTransforms.length - 1
    ];
describe('.addJSXClassName', () => {
    it('adds a classname to an element that has none', () => {
        CheckboxModule.addJSXClassName('Status', '"status-class"');
        expect(latestTransform()).toMatchSnapshot();
    });
    it('appends a classname to an element that has a literal one', () => {
        CheckboxModule.addJSXClassName(
            'span className="literal-classname"',
            'classes.icon'
        );
        expect(latestTransform()).toMatchSnapshot();
    });
    it('appends a classname to an element that has an interpolated one', () => {
        CheckboxModule.addJSXClassName(
            'span className={classes.label}',
            '"another-literal" + "-classname"'
        );
        expect(latestTransform()).toMatchSnapshot();
    });
    it('appends a classname to an element that has already had this method run on it', () => {
        CheckboxModule.addJSXClassName(
            'span className={classes.label}',
            '"oh-you"'
        );
        expect(latestTransform()).toMatchSnapshot();
    });
});
describe('.addReactLazyImport()', () => {
    it('adds a static import of React.lazy once and then each lazy import only once', () => {
        const dynamicComponents = [
            CheckboxModule.addReactLazyImport(
                './path/to/dynamic/component',
                'Blerg'
            ),
            CheckboxModule.addReactLazyImport(
                './path/to/dynamic/component',
                'Snerg'
            ),
            CheckboxModule.addReactLazyImport(
                './path/to/another/component',
                'Blerg'
            ),
            CheckboxModule.addReactLazyImport('./path/to/a-third/component')
        ];
        CheckboxModule.appendJSX(
            'span',
            `<><${dynamicComponents.join('/><')}/></>`
        );
        expect(
            CheckboxModule._queuedTransforms.map(transform => transform.options)
        ).toMatchSnapshot();
    });
});
describe('JSX manipulation', () => {
    it('.appendJSX()', () => {
        CheckboxModule.appendJSX(
            'span className={classes.icon}',
            '<AnotherEmoji />'
        );
        expect(latestTransform()).toMatchSnapshot();
    });
    it('.insertAfterJSX()', () => {
        CheckboxModule.insertAfterJSX('<Message>', '<Rakim />');
        expect(latestTransform()).toMatchSnapshot();
    });
    it('.insertBeforeJSX()', () => {
        CheckboxModule.insertBeforeJSX('<Message>', '<EricB and={and} />');
        expect(latestTransform()).toMatchSnapshot();
    });
    it('.prependJSX()', () => {
        CheckboxModule.prependJSX(
            '<span className={classes.icon} />',
            '<AnEmoji/>'
        );
        expect(latestTransform()).toMatchSnapshot();
    });
    it('.removeJSX()', () => {
        CheckboxModule.removeJSX('AnotherEmoji');
        expect(latestTransform()).toMatchSnapshot();
    });
    it('.removeJSXProps()', () => {
        CheckboxModule.removeJSXProps('BasicCheckbox', [
            'fieldState',
            'id'
        ]).removeJSXProps('label', ['htmlFor'], { global: true });
        expect(latestTransform()).toMatchSnapshot();
    });
    it('.replaceJSX()', () => {
        CheckboxModule.replaceJSX(
            'span className={classes.label}',
            '<i>where is label oh no</i>'
        );
        expect(latestTransform()).toMatchSnapshot();
    });
    it('.setJSXProps()', () => {
        CheckboxModule.setJSXProps('BasicCheckbox', {
            key: '{NUMBER}'
        }).setJSXProps('Message', { className: '"wildin"' }, { global: true });
        expect(latestTransform()).toMatchSnapshot();
    });
    it('.surroundJSX()', () => {
        CheckboxModule.surroundJSX('label', '<fieldset></fieldset>', {
            global: true
        });
        expect(latestTransform()).toMatchSnapshot();
    });

    it('really ties the room together', async () => {
        const babel = require('@babel/core');
        const spliceSourceLoader = require('../../loaders/splice-source-loader');
        const { runLoader } = require('../../../TestHelpers/testWebpackLoader');
        const requests = { splice: [], babel: [] };
        for (const request of CheckboxModule.flush()) {
            if (request.type === 'source') {
                requests.splice.push(request.options);
            } else {
                requests.babel.push(request);
            }
        }
        const loadedSource = await runLoader(
            spliceSourceLoader,
            checkboxSource,
            { query: requests.splice }
        );
        const { code } = await babel.transformAsync(loadedSource.output, {
            plugins: [
                [
                    require.resolve('../BabelModifyJSXPlugin/plugin.js'),
                    {
                        requestsByFile: {
                            [fileToTransform]: requests.babel
                        }
                    }
                ]
            ],
            filename: fileToTransform
        });
        expect(code).toMatchSnapshot();
    });
});
