const mergeOperations = (defaultOperations, operationsToOverride) => {
    if (!defaultOperations) {
        // return new object with the override operations as contents
        return { ...operationsToOverride };
    } else if (!operationsToOverride) {
        // return new object with the default operations as contents
        return {
            ...defaultOperations
        };
    } else {
        // return new object with the default adn override operations merged
        return {
            ...defaultOperations,
            ...operationsToOverride
        };
    }
};

export default mergeOperations;
