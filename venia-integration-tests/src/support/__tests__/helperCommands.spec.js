const mockAdd = jest.fn();
const mockThen = jest.fn();
const mockShould = jest.fn().mockReturnValue({
    then: mockThen
});
const mockIts = jest.fn().mockReturnValue({
    should: mockShould
});
const mockGet = jest.fn().mockReturnValue({
    its: mockIts
});

beforeAll(() => {
    global.Cypress = {
        Commands: {
            add: mockAdd
        }
    };

    global.cy = {
        get: mockGet
    };
});

afterAll(() => {
    delete global.Cypress;
    delete global.cy;
});

test('should match document snapshot', () => {
    require('../helperCommands');

    expect(mockAdd.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "getIframeBody",
            [Function],
          ],
        ]
    `);

    const getIframeBody = mockAdd.mock.calls[0][1];
    getIframeBody({ name: 'sample page snapshot' });
});
