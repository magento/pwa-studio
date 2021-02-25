const yargs = require('yargs');

const createProjectCliBuilder = require('../cli/create-project');

jest.mock('yargs');

const version = jest.fn().mockName('version');
const showHelpOnFail = jest.fn().mockName('showHelpOnFail');
const positional = jest.fn().mockName('positional');
const group = jest.fn().mockName('group');
const options = jest.fn().mockName('options');
const help = jest.fn().mockName('help');

const yargsAPI = {
    version,
    showHelpOnFail,
    positional,
    group,
    options,
    help
};

version.mockReturnValue(yargsAPI);
showHelpOnFail.mockReturnValue(yargsAPI);
positional.mockReturnValue(yargsAPI);
group.mockReturnValue(yargsAPI);
options.mockReturnValue(yargsAPI);
help.mockReturnValue(yargsAPI);

beforeAll(() => {
    yargs.mockReturnValue(yargsAPI);
});

test('should call version', () => {
    const version = jest.spyOn(yargs, 'version');
    createProjectCliBuilder.builder(yargs);

    expect(version).toHaveBeenCalled();
});
