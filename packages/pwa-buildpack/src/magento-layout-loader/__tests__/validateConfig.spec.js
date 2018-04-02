const validateConfig = require('../validateConfig');

test('Returns actionable error for missing required field', () => {
    const config = {
        'foo.bar': [
            {
                operation: 'removeContainer'
            }
        ]
    };
    const { error } = validateConfig(config);
    expect(error).toContain('should have required property');
});

test('Returns actionable error for typos/extra props', () => {
    const config = {
        'foo.bar': [
            {
                operation: 'removeContainer',
                targetcontainer: 'foo.bar'
            }
        ]
    };
    const { error } = validateConfig(config);
    expect(error).toContain('should NOT have additional properties');
});

test('Returns actionable error for incorrect types', () => {
    const config = {
        'foo.bar': [
            {
                operation: 'removeContainer',
                targetContainer: 1
            }
        ]
    };
    const { error } = validateConfig(config);
    // Note: The full error returned here doesn't specify
    // which field had the wrong type, which is awful. Should
    // iterate on this further
    expect(error).toContain('should be string');
});

test('Validates all configs for a single Container', () => {
    const config = {
        'foo.bar': [
            {
                // correct
                operation: 'removeContainer',
                targetContainer: 'foo.bar'
            },
            {
                // wrong
                operation: 'removeChild',
                targetContainer: 'bizz.bazz'
            }
        ]
    };
    const { error } = validateConfig(config);
    expect(error).toContain('should have required property');
});

test('Validates all configs for multiple Containers', () => {
    const config = {
        'foo.bar': [
            {
                // correct
                operation: 'removeContainer',
                targetContainer: 'foo.bar'
            }
        ],
        'bizz.bazz': [
            {
                // wrong
                operation: 'removeChild',
                targetContainer: 'bizz.bazz'
            }
        ]
    };
    const { error } = validateConfig(config);
    expect(error).toContain('should have required property');
});
