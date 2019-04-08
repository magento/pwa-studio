const path = require('path');
// we expect the root of any package we run inside
const mockModuleDir = path.resolve(__dirname, '../../../');
const mockFilePath = require.resolve('../resolveModuleDirectory');
const resolveModuleDirectory = require('../resolveModuleDirectory');

test('returns a directory within a module dependency instead of its index file', async () => {
    expect(await resolveModuleDirectory(mockFilePath, 'subdir')).toEqual(
        path.join(mockModuleDir, 'subdir')
    );
});
