const mockAdd = jest.fn();
const mockDocument = jest.fn().mockResolvedValue({
    documentElement: {
        scrollHeight: 1000,
        clientHeight: 200
    }
});
const mockScroll = jest.fn();
const mockWait = jest.fn();

beforeAll(() => {
    global.Cypress = {
        Commands: {
            add: mockAdd
        }
    };

    global.cy = {
        document: mockDocument,
        scrollTo: mockScroll,
        wait: mockWait
    };
});

afterAll(() => {
    delete global.Cypress;
    delete global.cy;
});

test('should scroll and take full page screenshot', async () => {
    require('../loadFullPageCommand');

    expect(mockAdd.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "loadFullPage",
            [Function],
          ],
        ]
    `);

    const loadFullPage = mockAdd.mock.calls[0][1];

    await loadFullPage(500);

    expect(mockScroll.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "0px",
            "200px",
          ],
          Array [
            "0px",
            "400px",
          ],
          Array [
            "0px",
            "600px",
          ],
          Array [
            "0px",
            "800px",
          ],
          Array [
            "0px",
            "1000px",
          ],
        ]
    `);
    expect(mockWait.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            500,
          ],
          Array [
            500,
          ],
          Array [
            500,
          ],
          Array [
            500,
          ],
          Array [
            500,
          ],
        ]
    `);
});

test('should scroll and take full page screenshot', async () => {
    mockWait.mockClear();

    require('../loadFullPageCommand');

    const loadFullPage = mockAdd.mock.calls[0][1];

    await loadFullPage();

    expect(mockWait.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            1000,
          ],
          Array [
            1000,
          ],
          Array [
            1000,
          ],
          Array [
            1000,
          ],
          Array [
            1000,
          ],
        ]
    `);
});
