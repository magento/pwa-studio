module.exports = {
    configuredDomains: jest.fn().mockReturnValue([]),
    certificateFor: jest.fn().mockReturnValue({
        key: 'fakekey',
        cert: 'fakecert'
    })
};
