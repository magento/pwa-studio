const pkgDir = require('pkg-dir');
const { join, resolve } = require('path');

const BUILDPACK_DIR = '_buildpack/';

function getInstruction(rootDir, instructionType) {
    const instructionScriptName = join(BUILDPACK_DIR, instructionType) + '.js';
    const instructionScriptPath = resolve(
        rootDir,
        BUILDPACK_DIR,
        instructionType
    );
    try {
        return require(instructionScriptPath);
    } catch (e) {
        throw new Error(
            `Buildpack could not find a valid '${instructionScriptName}' file in ${rootDir}. This file must be present to instruct Buildpack how to use the ${rootDir} package to perform the "${instructionType}" operation. Original error: ${
                e.message
            }`
        );
    }
}

function getBuildpackInstructions(packageOrDir, instructionTypes) {
    let packageRoot;
    try {
        packageRoot = pkgDir.sync(require.resolve(packageOrDir));
    } catch (e) {
        packageRoot = resolve(packageOrDir);
    }
    const instructions = {};
    instructionTypes.forEach(type => {
        instructions[type] = getInstruction(packageRoot, type);
    });
    return {
        packageRoot,
        instructions
    };
}

module.exports = getBuildpackInstructions;
module.exports.BUILDPACK_DIR = BUILDPACK_DIR;
