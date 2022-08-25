const { read } = require('jimp');
const { existsSync } = require('fs');
const { matchImageSnapshotPlugin } = require('cypress-image-snapshot/plugin');

const {
    addSnapshotResizePlugin,
    resizeSnapshot
} = require('../resizeSnapshotPlugin');

jest.mock('jimp', () => ({
    read: jest.fn()
}));

jest.mock('cypress-image-snapshot/plugin', () => ({
    matchImageSnapshotPlugin: jest.fn()
}));

jest.mock('fs', () => ({
    existsSync: jest.fn().mockReturnValue(true),
    readFileSync: jest.fn().mockReturnValue('image data')
}));

const mockWriteAsync = jest.fn().mockResolvedValue({});
const mockResize = jest.fn().mockReturnValue({ writeAsync: mockWriteAsync });

beforeAll(() => {
    read.mockResolvedValue({
        resize: mockResize
    });
});

beforeEach(() => {
    jest.clearAllMocks();
});

const imageConfig = {
    path: 'path/to/the/snapshot/image',
    pixelRatio: 2,
    dimensions: {
        width: 100,
        height: 100
    }
};

describe('testing resizeSnapshot', () => {
    test('should write resized image to filesystem if exists', async () => {
        const updatedImageConfig = await resizeSnapshot(imageConfig);

        expect(read).toHaveBeenCalledWith('image data');
        expect(mockResize).toHaveBeenCalledWith(50, 50);
        expect(mockWriteAsync).toHaveBeenCalledWith(
            'path/to/the/snapshot/image'
        );
        expect(updatedImageConfig).toMatchInlineSnapshot(`
            Object {
              "dimensions": Object {
                "height": 50,
                "width": 50,
              },
              "path": "path/to/the/snapshot/image",
              "pixelRatio": 1,
            }
        `);
    });

    test('should not attemp to resize if image is not available', async () => {
        existsSync.mockReturnValueOnce(false).mockReturnValueOnce(false);

        const updatedImageConfig = await resizeSnapshot(imageConfig);

        expect(mockResize).not.toHaveBeenCalled();
        expect(mockWriteAsync).not.toHaveBeenCalled();
        expect(updatedImageConfig).toMatchInlineSnapshot(`
            Object {
              "dimensions": Object {
                "height": 100,
                "width": 100,
              },
              "path": "path/to/the/snapshot/image",
              "pixelRatio": 2,
            }
        `);
    });
});

describe('testing addSnapshotResizePlugin', () => {
    test('should register task and screenshot plugins', () => {
        const on = jest.fn();

        addSnapshotResizePlugin(on);

        expect(on.mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                "task",
                Object {
                  "resizeSnapshot": [Function],
                },
              ],
              Array [
                "after:screenshot",
                [Function],
              ],
            ]
        `);
    });

    test('after:screenshot should return correct shape', async () => {
        const on = jest.fn();

        addSnapshotResizePlugin(on);

        const [, screenshotResizeFn] = on.mock.calls.find(
            call => call[0] === 'after:screenshot'
        );

        await screenshotResizeFn({ ...imageConfig, name: 'sample snapshot' });

        expect(matchImageSnapshotPlugin.mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                Object {
                  "dimensions": Object {
                    "height": 100,
                    "width": 100,
                  },
                  "name": "sample-snapshot",
                  "path": "path/to/the/snapshot/image",
                  "pixelRatio": 2,
                },
              ],
            ]
        `);
    });
});
