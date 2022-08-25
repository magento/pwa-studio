const TargetableModule = require('../TargetableModule');

test('constructs with a filename and a parent trackable', () => {
    TargetableModule.enableTracking();
    const trackFn = jest.fn();
    const filePath = './path/somewhere';
    const fakeModule = new TargetableModule(filePath, trackFn);
    fakeModule.track('uhhh');
    expect(trackFn).toHaveBeenCalledWith(
        expect.objectContaining({ id: filePath, type: 'TargetableModule' }),
        'uhhh'
    );
    TargetableModule.disableTracking();
});

test('formats transforms with addTransform and then flushes them with flush', () => {
    const trackFn = jest.fn();
    const fileToTransform = './path/somewhere';
    const fakeModule = new TargetableModule(fileToTransform, trackFn);
    fakeModule.addTransform('babel', '/path/to/FakeBabelPlugin', {
        option1: 'door 1',
        option2: 'door 2'
    });
    fakeModule.addTransform('source', '/path/to/loader', {
        loaderOption1: 'no'
    });
    expect(fakeModule.flush()).toMatchObject([
        {
            type: 'babel',
            fileToTransform,
            transformModule: '/path/to/FakeBabelPlugin',
            options: {
                option1: 'door 1',
                option2: 'door 2'
            }
        },
        {
            type: 'source',
            fileToTransform,
            transformModule: '/path/to/loader',
            options: { loaderOption1: 'no' }
        }
    ]);

    // flush clears the queued transforms out
    expect(fakeModule.flush()).toHaveLength(0);
});

describe('has convenience methods for source code transforms', () => {
    const sonnet71 = `No longer mourn for me when I am dead
    Than you shall hear the surly sullen bell
    Give warning to the world that I am fled
    From this vile world with vilest worms to dwell:
    Nay, if you read this line, remember not
    The hand that writ it, for I love you so,
    That I in your sweet thoughts would be forgot,
    If thinking on me then should make you woe.
    O! if,--I say you look upon this verse,
    When I perhaps compounded am with clay,
    Do not so much as my poor name rehearse;
    But let your love even with my life decay;
    Lest the wise world should look into your moan,
    And mock you with me after I am gone.`;

    const spliceLoader = require('../../loaders/splice-source-loader');
    const { runLoader } = require('../../../TestHelpers');

    const fakeModule = new TargetableModule('./path/somewhere', jest.fn());
    const latestTransform = () =>
        fakeModule._queuedTransforms[fakeModule._queuedTransforms.length - 1];

    it('.insertAfterSource()', () => {
        const after = 'I say';
        const insert = ' well, I say';
        fakeModule.insertAfterSource(after, insert);
        expect(latestTransform()).toMatchObject({
            type: 'source',
            transformModule: expect.stringContaining('splice-source-loader'),
            options: {
                after,
                insert
            }
        });
    });
    it('.insertBeforeSource()', () => {
        const options = {
            before: 'When I perhaps',
            insert: 'Talkin bout, w',
            remove: 1
        };
        fakeModule.insertBeforeSource(options.before, options.insert, {
            remove: options.remove
        });
        expect(latestTransform()).toMatchObject({
            options
        });
    });
    it('.prependSource()', () => {
        const insert = 'I tell ya hwat.';
        fakeModule.prependSource(insert);
        expect(latestTransform()).toMatchObject({
            options: {
                at: 0,
                insert
            }
        });
    });
    it('.spliceSource()', () => {
        const options = {
            at: 15,
            insert: '\n'
        };
        fakeModule.spliceSource(options);
        expect(latestTransform()).toMatchObject({
            options
        });
    });
    it('composes all these together', async () => {
        const query = fakeModule.flush().map(req => req.options);
        const result = await runLoader(spliceLoader, sonnet71, { query });
        expect(result.context.getCalls('emitError')).toHaveLength(0);
        expect(result.output).toMatchInlineSnapshot(`
            "I tell ya hwat.
            No longer mourn for me when I am dead
                Than you shall hear the surly sullen bell
                Give warning to the world that I am fled
                From this vile world with vilest worms to dwell:
                Nay, if you read this line, remember not
                The hand that writ it, for I love you so,
                That I in your sweet thoughts would be forgot,
                If thinking on me then should make you woe.
                O! if,--I say well, I say you look upon this verse,
                Talkin bout, when I perhaps compounded am with clay,
                Do not so much as my poor name rehearse;
                But let your love even with my life decay;
                Lest the wise world should look into your moan,
                And mock you with me after I am gone."
        `);
    });
});
