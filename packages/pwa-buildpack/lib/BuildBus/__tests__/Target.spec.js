const Target = require('../Target');

const mockTapable = () => ({
    call: jest.fn().mockName('tapable#call'),
    intercept: jest.fn().mockName('tapable#intercept'),
    tap: jest.fn().mockName('tapable#tap'),
    tapAsync: jest.fn().mockName('tapable#tapAsync'),
    tapPromise: jest.fn().mockName('tapable#tapPromise')
});

test('calls underlying tapable', () => {
    const tapable = mockTapable();
    new Target(
        'mockOwner',
        'mockRequestor',
        'mockTargetName',
        'mockTapableType',
        tapable
    ).call('one', 'two');
    expect(tapable.call).toHaveBeenCalledWith('one', 'two');
});

test('runs interception methods on underlying tapable with default name argument', () => {
    const tapable = mockTapable();
    const target = new Target(
        'mockOwner',
        'mockRequestor',
        'mockTargetName',
        'mockTapableType',
        tapable
    );
    target.intercept('mockInterceptor');
    expect(tapable.intercept).toHaveBeenCalledWith('mockInterceptor');
    target.tap('mockTap');
    expect(tapable.tap).toHaveBeenCalledWith('mockRequestor', 'mockTap');
    target.tapAsync('mockTapAsync');
    expect(tapable.tapAsync).toHaveBeenCalledWith(
        'mockRequestor',
        'mockTapAsync'
    );
    target.tapPromise('mockTapPromise');
    expect(tapable.tapPromise).toHaveBeenCalledWith(
        'mockRequestor',
        'mockTapPromise'
    );
});

test('runs tap methods on underlying tapable with custom name argument', () => {
    const tapable = mockTapable();
    const target = new Target(
        'mockOwner',
        'mockRequestor',
        'mockTargetName',
        'mockTapableType',
        tapable
    );
    target.tap('MockTapName', 'mockTap');
    expect(tapable.tap).toHaveBeenCalledWith(
        'mockRequestor:MockTapName',
        'mockTap'
    );
    target.tapAsync('MockTapName2', 'mockTapAsync');
    expect(tapable.tapAsync).toHaveBeenCalledWith(
        'mockRequestor:MockTapName2',
        'mockTapAsync'
    );
    target.tapPromise('MockTapName3', 'mockTapPromise');
    expect(tapable.tapPromise).toHaveBeenCalledWith(
        'mockRequestor:MockTapName3',
        'mockTapPromise'
    );
});
