const identity = input => input;

export default jest.fn(identity).mockName('resourceUrl');
