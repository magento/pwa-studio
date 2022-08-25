const {
    SyncBailHook,
    SyncWaterfallHook,
    AsyncSeriesWaterfallHook
} = require('tapable');
const Target = require('../Target');

test('runs sync interception methods on underlying tapable with default name argument', () => {
    const bails = new SyncBailHook(['arg1']);
    const bailTarget = new Target(
        'mockPackage',
        'mockPackage',
        'mockTargetName',
        'mockTapableType',
        bails
    );
    const tapInfoSpy = jest.fn();
    bailTarget.intercept({
        register(tapInfo) {
            tapInfoSpy(tapInfo);
        }
    });
    bailTarget.tap({
        name: 'BailIfAsked',
        fn: x => {
            if (x.bailMe) {
                return `${x.txt}: AAAAAAA`;
            }
        }
    });

    expect(tapInfoSpy).toHaveBeenCalledWith(
        expect.objectContaining({
            type: 'sync',
            name: `mockPackage${Target.SOURCE_SEP}BailIfAsked`
        })
    );

    const skippedHook = jest.fn();
    bailTarget.tap(x => skippedHook(x));

    expect(tapInfoSpy).toHaveBeenCalledWith(
        expect.objectContaining({
            type: 'sync',
            name: 'mockPackage'
        })
    );

    const hookRetVal = bailTarget.call('yes!');
    expect(hookRetVal).toBeUndefined();
    expect(skippedHook).toHaveBeenCalledWith('yes!');

    // now mess with hooks
    bailTarget.intercept({
        call: x => {
            x.txt = 'noooooo!';
            x.bailMe = true;
        }
    });

    const hookRetVal2 = bailTarget.call({ txt: 'maybe?' });
    expect(hookRetVal2).toBe('noooooo!: AAAAAAA');

    expect(skippedHook).toHaveBeenCalledTimes(1);
});

test('runs async interception methods on underlying tapable', async done => {
    const asyncWaterfalls = new AsyncSeriesWaterfallHook(['a']);
    const asyncTarget = new Target(
        'mockPackage',
        'mockPackage',
        'mockTargetName',
        'AsyncWaterfall',
        asyncWaterfalls
    );

    const tapInfoSpy = jest.fn();
    asyncTarget.intercept({
        register(tapInfo) {
            tapInfoSpy(tapInfo);
        }
    });

    asyncTarget.tapAsync((abc, next) => next(null, abc + 'def'));

    expect(tapInfoSpy).toHaveBeenCalledWith(
        expect.objectContaining({
            type: 'async',
            name: 'mockPackage'
        })
    );

    asyncTarget.tapPromise(def => Promise.resolve(def + 'g'));

    await expect(asyncTarget.promise('xyz')).resolves.toBe('xyzdefg');

    asyncTarget.callAsync('ABC', (e, result) => {
        expect(result).toBe('ABCdefg');
        done();
    });
});

test('throws when external consumer invokes a call method', async () => {
    const syncHook = new SyncWaterfallHook(['x']);
    const asyncHook = new AsyncSeriesWaterfallHook(['x']);

    const ownSync = new Target(
        'mockPackage',
        'mockPackage',
        'mockTargetName',
        'SyncBail',
        syncHook
    );
    const externalSync = new Target.External(
        'mockPackage',
        'externalPackage',
        'mockTargetName',
        'SyncBail',
        syncHook
    );
    const ownAsync = new Target(
        'mockPackage',
        'mockPackage',
        'mockTargetName',
        'AsyncSeriesWaterfall',
        asyncHook
    );
    const externalAsync = new Target.External(
        'mockPackage',
        'externalPackage',
        'mockTargetName',
        'AsyncSeriesWaterfall',
        asyncHook
    );

    ownSync.tap(x => x * 2);
    ownAsync.tapPromise(async x => x - 1);

    externalSync.tap(x => x * 3);
    externalAsync.tapPromise(async x => x - 2);

    expect(() => externalSync.call(1)).toThrowErrorMatchingSnapshot();
    expect(() => externalAsync.callAsync(1)).toThrowErrorMatchingSnapshot();
    expect(() => externalAsync.promise(1)).toThrowErrorMatchingSnapshot();

    expect(ownSync.call(1)).toBe(6);
    await expect(ownAsync.promise(1)).resolves.toBe(-2);
    await expect(
        new Promise((res, rej) => {
            ownAsync.callAsync(10, (e, result) => (e ? rej(e) : res(result)));
        })
    ).resolves.toBe(7);
});

test('serializes with its requestor', () => {
    const syncHook = new SyncWaterfallHook(['x']);
    const ownSync = new Target(
        () => {},
        'mockRequestor',
        'mockTargetName',
        'SyncBail',
        syncHook
    );
    expect(ownSync.toJSON()).toBeUndefined();
    Target.enableTracking();
    expect(ownSync.toJSON()).toMatchObject({
        type: 'Target',
        id: 'mockTargetName[SyncBail]',
        requestor: 'mockRequestor'
    });
    Target.disableTracking();
});
