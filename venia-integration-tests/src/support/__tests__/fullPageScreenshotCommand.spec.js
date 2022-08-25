const mockAdd = jest.fn();
const mockMatchImageSnapshot = jest.fn();
const mockDocument = jest.fn().mockReturnValue({
    matchImageSnapshot: mockMatchImageSnapshot
});
const mockInvoke = jest.fn();
const mockGet = jest.fn().mockReturnValue({
    invoke: mockInvoke
});

beforeAll(() => {
    global.Cypress = {
        Commands: {
            add: mockAdd
        }
    };

    global.cy = {
        document: mockDocument,
        get: mockGet
    };
});

afterAll(() => {
    delete global.Cypress;
    delete global.cy;
});

test('should match document snapshot', () => {
    require('../fullPageScreenshotCommand');

    expect(mockAdd.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "captureFullPageScreenshot",
            [Function],
          ],
        ]
    `);

    const captureFullPageScreenshot = mockAdd.mock.calls[0][1];
    captureFullPageScreenshot({ name: 'sample page snapshot' });

    expect(mockMatchImageSnapshot.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "sample-page-snapshot",
            Object {
              "comparisonMethod": "ssim",
              "failureThreshold": 0.01,
              "failureThresholdType": "percent",
              "name": "sample-page-snapshot",
            },
          ],
        ]
    `);
});

test('should throw error if name is not provided', () => {
    require('../fullPageScreenshotCommand');

    const captureFullPageScreenshot = mockAdd.mock.calls[0][1];
    expect(() => captureFullPageScreenshot({})).toThrow();
});

test('should use custom options if provided', () => {
    mockMatchImageSnapshot.mockClear();

    require('../fullPageScreenshotCommand');

    const captureFullPageScreenshot = mockAdd.mock.calls[0][1];
    captureFullPageScreenshot({
        name: 'sample page snapshot',
        failureThreshold: 0.2
    });

    expect(mockMatchImageSnapshot.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "sample-page-snapshot",
            Object {
              "comparisonMethod": "ssim",
              "failureThreshold": 0.2,
              "failureThresholdType": "percent",
              "name": "sample-page-snapshot",
            },
          ],
        ]
    `);
});
