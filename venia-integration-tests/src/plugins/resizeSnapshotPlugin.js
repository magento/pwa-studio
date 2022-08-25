const jimp = require('jimp');
const fs = require('fs');
const { matchImageSnapshotPlugin } = require('cypress-image-snapshot/plugin');

const resizeSnapshot = imageConfig => {
    const { path, pixelRatio, dimensions } = imageConfig;
    const { width, height } = dimensions;

    const newDimensions = {
        width: width / pixelRatio,
        height: height / pixelRatio
    };

    if (fs.existsSync(path)) {
        const imageData = fs.readFileSync(path);

        return jimp
            .read(imageData)
            .then(image => {
                return image
                    .resize(newDimensions.width, newDimensions.height)
                    .writeAsync(path)
                    .then(() => {
                        return {
                            ...imageConfig,
                            dimensions: newDimensions,
                            pixelRatio: 1
                        };
                    });
            })
            .catch(() => {
                return;
            });
    } else {
        return Promise.resolve(imageConfig);
    }
};

const replaceSpace = str => {
    if (/ \(attempt [0-9]+\)/.test(str)) {
        return str;
    }
    return str.split(' ').join('-');
};

const adjustDetails = screenshotDetails => {
    return {
        ...screenshotDetails,
        name: replaceSpace(screenshotDetails.name),
        path: replaceSpace(screenshotDetails.path)
    };
};

const addSnapshotResizePlugin = on => {
    on('task', {
        resizeSnapshot
    });
    on('after:screenshot', rawScreenshotDetails => {
        const screenshotDetails = adjustDetails(rawScreenshotDetails);

        return resizeSnapshot(screenshotDetails)
            .then(screenshotDetails => {
                matchImageSnapshotPlugin(screenshotDetails);
            })
            .catch(err => {
                console.error('Something went wrong', err);
            });
    });
};

module.exports = { resizeSnapshot, addSnapshotResizePlugin };
