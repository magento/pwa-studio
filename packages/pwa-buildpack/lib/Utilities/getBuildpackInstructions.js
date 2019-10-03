const findPackageRoot = require('./findPackageRoot');
const { join, resolve } = require('path');

const BUILDPACK_DIR = '_buildpack/';

async function getInstruction(rootDir, instructionType) {
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

async function getBuildpackInstructions(packageName, instructionTypes) {
    const packageRoot = await findPackageRoot.local(packageName);
    if (!packageRoot) {
        throw new Error(
            `Buildpack could not find a valid package in ${packageName}. A valid package must have a package.json file and a ${BUILDPACK_DIR} directory.`
        );
    }
    const instructions = {};
    const instructionImpls = await Promise.all(
        instructionTypes.map(type => getInstruction(packageRoot, type))
    );
    instructionImpls.forEach((impl, i) => {
        instructions[instructionTypes[i]] = impl;
    });
    return {
        packageRoot,
        instructions
    };
}

module.exports = getBuildpackInstructions;
module.exports.BUILDPACK_DIR = BUILDPACK_DIR;
