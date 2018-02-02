let vfs = {};
const fs = jest.genMockFromModule('fs');
fs.__mockWriteFileSync = (filename, contents) => {
    vfs[filename] = contents;
};
fs.writeFileSync.mockImplementation(fs.__mockWriteFileSync);
fs.__mockReadFileSync = filename => {
    return vfs[filename];
};
fs.readFileSync.mockImplementation(fs.__mockReadFileSync);
fs.__reset = () => {
    vfs = {};
};
module.exports = fs;
