jest.mock('fs');
jest.mock('node-fetch');

const fs = require('fs');
const fetch = require('node-fetch');

const IOAdapter = require('../IOAdapter');

// Mock stat callback style, because util.promisify will transform it
fs.stat.mockImplementation((path, cb) =>
    setImmediate(cb.bind(null, null, { size: 1024 }))
);

test('IOAdapter.default(upwardPath) uses fs and node-fetch', async () => {
    const io = IOAdapter.default('/path/to/dir/upward.yml');
    await io.createReadFileStream('some/file.png');
    expect(fs.createReadStream).toHaveBeenCalledWith(
        '/path/to/dir/some/file.png',
        expect.objectContaining({ encoding: undefined })
    );
    await io.networkFetch('https://example.com', { method: 'POST' });
    expect(fetch).toHaveBeenCalledWith(
        'https://example.com',
        expect.objectContaining({ method: 'POST' })
    );
});

test('IOAdapter.default limits access to base directory', async () => {
    const io = IOAdapter.default('/path/to/dir/upward.yml');
    await expect(
        io.createReadFileStream('/absolute/some/file.png')
    ).rejects.toThrow('outside /path/to/dir');
});

test('constructor uses passed implementations', () => {
    const stream = {};
    const size = 1234;
    const response = {};
    const io = new IOAdapter({
        createReadFileStream: jest.fn().mockReturnValue(stream),
        getFileSize: jest.fn().mockReturnValue(size),
        networkFetch: jest.fn().mockReturnValue(response)
    });
    expect(io.createReadFileStream()).toBe(stream);
    expect(io.getFileSize()).toBe(size);
    expect(io.networkFetch()).toBe(response);
});

test('constructor throws if implementations are missing', () => {
    expect(() => new IOAdapter({})).toThrow('Must provide an implementation');
});
