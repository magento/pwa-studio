let __mock = {};
const removeCallback = (__mock.removeCallback = jest.fn());
const fileSync = jest.fn(() => ({
    name: (__mock.lastTmpName = Math.random()
        .toString(36)
        .slice(2)),
    removeCallback
}));
const setGracefulCleanup = jest.fn();

const FakeTmp = {
    fileSync,
    setGracefulCleanup,
    __mock
};

module.exports = FakeTmp;
