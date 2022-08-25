// Utility to match GraphQL mutation based on the operation name
export const hasOperationName = (req, operationName) => {
    const { body } = req;
    return (
        body.hasOwnProperty('operationName') &&
        body.operationName === operationName
    );
};

// Alias mutation if operationName matches
export const aliasMutation = (req, operationName) => {
    if (hasOperationName(req, operationName)) {
        req.alias = `gql${operationName}Mutation`;
    }
};
