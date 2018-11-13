const validCreateAccountParams = ['email', 'firstName', 'lastName'];

export const getCreateAccountInitialValues = () => {
    const params = new URLSearchParams(window.location.search);
    return validCreateAccountParams.reduce(
        (values, param) => ({ ...values, [param]: params.get(param) }),
        {}
    );
};
