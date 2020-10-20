import mergeOperations from '../mergeOperations';

test('should merge operations', () => {
    const defaultOperations = {
        operation1: 'operation 1',
        operation2: 'operation 2'
    };
    const overrideOperations = {
        operation2: 'overriden operation 2',
        operation3: 'operation 3'
    };

    const mergedOperations = mergeOperations(
        defaultOperations,
        overrideOperations
    );

    expect(mergedOperations).toMatchObject({
        operation1: 'operation 1',
        operation2: 'overriden operation 2',
        operation3: 'operation 3'
    });
});

test('should handle falsy default operations object', () => {
    const defaultOperations = null;
    const overrideOperations = {
        operation2: 'overriden operation 2',
        operation3: 'operation 3'
    };

    const mergedOperations = mergeOperations(
        defaultOperations,
        overrideOperations
    );

    expect(mergedOperations).toMatchObject({
        operation2: 'overriden operation 2',
        operation3: 'operation 3'
    });
});

test('should handle falsy override operations', () => {
    const defaultOperations = {
        operation1: 'operation 1',
        operation2: 'operation 2'
    };
    const overrideOperations = null;

    const mergedOperations = mergeOperations(
        defaultOperations,
        overrideOperations
    );

    expect(mergedOperations).toMatchObject({
        operation1: 'operation 1',
        operation2: 'operation 2'
    });
});
