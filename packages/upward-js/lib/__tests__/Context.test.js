const Context = require('../Context');

test('promises are cached', async () => {
    const context = new Context({});
    const downward = jest.fn(async () => ({ identity: 'same' }));
    context.setVisitor({ downward });

    await Promise.all([
        expect(context.get('identity')).resolves.toBe('same'),
        expect(context.get('identity')).resolves.toBe('same')
    ]);
    expect(context._promises.size).toBe(1);
});

test('cannot set context property twice', () => {
    const context = new Context({ immu: 'table' });
    expect(() => context.set('immu', 'nized')).toThrow(
        "Attempted to reassign context property 'immu' to 'nized'. Context properties cannot be reassigned."
    );
});

test('forget() deletes ephemeral data', async () => {
    const context = new Context({ mu: 'table' });
    const downward = jest.fn(async () => ({ mu: 'nificent' }));
    context.setVisitor({ downward });

    await expect(context.get('mu')).resolves.toBe('table');
    expect(downward).not.toHaveBeenCalled();
    context.forget('mu');
    await expect(context.get('mu')).resolves.toBe('nificent');
    expect(downward).toHaveBeenCalledWith(['mu']);
});

test('constants are always present', async () => {
    const context = new Context({});
    await expect(context.get('text/plain')).resolves.toBe('text/plain');
    await expect(context.get('208')).resolves.toBe('208');
});

test('user-agent is a valid header', async () => {
    const context = new Context({
        request: {
            'user-agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'
        }
    });
    await expect(context.get('request.user-agent')).resolves.toBe(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'
    );
});

test('support array brackets', async () => {
    const context = new Context({
        request: {
            '[0]': 'test-string'
        }
    });
    await expect(context.get('request.[0]')).resolves.toBe('test-string');
});
