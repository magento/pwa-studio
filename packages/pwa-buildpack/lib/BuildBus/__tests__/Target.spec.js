const { SyncBailHook, AsyncSeriesWaterfallHook } = require('tapable');
const Target = require('../Target');

test('runs sync interception methods on underlying tapable with default name argument', () => {
    const bails = new SyncBailHook(['arg1']);
    const bailTarget = new Target(
        'mockOwner',
        'mockRequestor',
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
    bailTarget.tap('BailIfAsked', x => {
        if (x.bailMe) {
            return `${x.txt}: AAAAAAA`;
        }
    });

    expect(tapInfoSpy).toHaveBeenCalledWith(
        expect.objectContaining({
            type: 'sync',
            name: 'mockRequestor:BailIfAsked'
        })
    );

    const skippedHook = jest.fn();
    bailTarget.tap(x => skippedHook(x));

    expect(tapInfoSpy).toHaveBeenCalledWith(
        expect.objectContaining({
            type: 'sync',
            name: 'mockRequestor'
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
        'mockOwner',
        'foo',
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
            name: 'foo'
        })
    );

    asyncTarget.tapPromise(def => Promise.resolve(def + 'g'));

    await expect(asyncTarget.promise('xyz')).resolves.toBe('xyzdefg');

    asyncTarget.callAsync('ABC', (e, result) => {
        expect(result).toBe('ABCdefg');
        done();
    });
});
