jest.mock('devcert', () => ({
    certificateFor: jest.fn(async () => {}),
    configuredDomains: jest.fn(() => [])
}));

jest.mock('../src/util/is-tty.js', () => jest.fn(() => true));
