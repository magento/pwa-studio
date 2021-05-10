const mockAdd = jest.fn();

beforeAll(() => {
    global.Cypress = {
        commands: {
            add: mockAdd
        }
    };
});

afterEach(() => {
    delete global.Cypress;
});

test('sup', () => {
    expect(true).toBeTruthy();
});
