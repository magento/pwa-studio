const fetch = require('node-fetch');
const inquirer = require('inquirer');
const isInvalidPath = require('is-invalid-path');
const execa = require('execa');

const createPWA = require('../lib/index');

jest.mock('node-fetch');

jest.mock('os', () => ({
    userInfo: jest.fn().mockReturnValue({
        username: 'gooseton',
        homedir: './untitledgeese'
    })
}));

jest.mock('git-user-info', () =>
    jest.fn().mockReturnValue({
        name: 'gooseton',
        email: 'gooseton@goosemail.com'
    })
);

jest.mock('inquirer', () => ({
    prompt: jest.fn().mockResolvedValue({
        directory: 'test',
        name: 'test',
        author: 'Gooston <gooston@goosemail.com>',
        template: '@magento/venia-concept@8.0.0',
        backendUrl:
            'https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/',
        backendEdition: 'AC',
        braintreeToken: 'sandbox_8yrzsvtm_s2bg8fs563crhqzk',
        npmClient: 'yarn',
        install: false
    })
}));

jest.mock('execa', () => ({
    shell: jest.fn().mockResolvedValue()
}));

jest.mock('is-invalid-path', () => jest.fn().mockReturnValue(false));

jest.mock('path', () => ({
    ...jest.requireActual('path'),
    resolve: jest.fn().mockImplementation(pathStr => {
        if (pathStr.includes('buildpack')) {
            return 'BUILDPACK_LOCATION';
        } else {
            return jest.requireActual('path').resolve(pathStr);
        }
    })
}));

beforeAll(() => {
    process.env.npm_config_user_agent = 'yarn';

    fetch.mockResolvedValueOnce({ ok: false }).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({
            sampleBackends: {
                environments: [
                    {
                        name: '2.3.3-venia-cloud',
                        description:
                            'Magento 2.3.3 with Venia sample data installed',
                        url:
                            'https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/'
                    },
                    {
                        name: '2.3.4-venia-cloud',
                        description:
                            'Magento 2.3.4 with Venia sample data installed',
                        url: 'https://www.magento-backend-2.3.4.com/'
                    }
                ]
            }
        })
    });
});

beforeEach(() => {
    inquirer.prompt.mockClear();
});

describe('Testing questions', () => {
    test('should have right shape', async () => {
        await createPWA();
        const questions = inquirer.prompt.mock.calls[0][0];

        expect(questions).toMatchSnapshot();
    });

    test('validating directory question', async () => {
        await createPWA();
        const questions = inquirer.prompt.mock.calls[0][0];
        const directoryQuestion = questions.find(
            question => question.name === 'directory'
        );

        isInvalidPath.mockReturnValue(false);
        expect(directoryQuestion.validate('test')).toMatchInlineSnapshot(
            `true`
        );
        expect(directoryQuestion.validate()).toMatchInlineSnapshot(
            `"Please enter a directory path"`
        );

        isInvalidPath.mockReturnValue(true);
        expect(directoryQuestion.validate('test')).toMatchInlineSnapshot(
            `"Invalid directory path; contains illegal characters"`
        );
        expect(directoryQuestion.validate()).toMatchInlineSnapshot(
            `"Please enter a directory path"`
        );
    });

    test('validating name default', async () => {
        await createPWA();
        const questions = inquirer.prompt.mock.calls[0][0];
        const nameQuestion = questions.find(
            question => question.name === 'name'
        );

        expect(nameQuestion.default({ directory: 'test' })).toBe('test');
    });

    test('validating author default', async () => {
        await createPWA();
        const questions = inquirer.prompt.mock.calls[0][0];
        const authorQuestion = questions.find(
            question => question.name === 'author'
        );

        expect(authorQuestion.default()).toBe(
            'gooseton <gooseton@goosemail.com>'
        );
    });

    test('validating template description', async () => {
        await createPWA();
        const questions = inquirer.prompt.mock.calls[0][0];
        const templateQuestion = questions.find(
            question => question.name === 'template'
        );

        expect(
            templateQuestion.message({ name: 'test' })
        ).toMatchInlineSnapshot(
            `"Which template would you like to use to bootstrap test? Defaults to \\"@magento/venia-concept\\"."`
        );
    });

    test('validating when of customBackendUrl', async () => {
        await createPWA();
        const questions = inquirer.prompt.mock.calls[0][0];
        const customBackendQuestion = questions.find(
            question => question.name === 'customBackendUrl'
        );

        expect(customBackendQuestion.when({ backendUrl: false })).toBeTruthy();
        expect(customBackendQuestion.when({ backendUrl: true })).toBeFalsy();
    });

    test('validating backendEdition default', async () => {
        await createPWA();
        const questions = inquirer.prompt.mock.calls[0][0];
        const backendEditionQuestion = questions.find(
            question => question.name === 'backendEdition'
        );

        expect(backendEditionQuestion.default).toBe('AC');
    });

    test('validating npmClient default if process.env.npm_config_user_agent includes yarn', async () => {
        const defaultClient = process.env.npm_config_user_agent;
        process.env.npm_config_user_agent = 'yarn';

        await createPWA();
        const questions = inquirer.prompt.mock.calls[0][0];
        const npmClientQuestion = questions.find(
            question => question.name === 'npmClient'
        );

        expect(npmClientQuestion.default).toBe('yarn');

        process.env.npm_config_user_agent = defaultClient;
    });

    test('validating npmClient default if process.env.npm_config_user_agent does not include yarn', async () => {
        const defaultClient = process.env.npm_config_user_agent;
        process.env.npm_config_user_agent = 'something other than y-a-r-n';

        await createPWA();
        const questions = inquirer.prompt.mock.calls[0][0];
        const npmClientQuestion = questions.find(
            question => question.name === 'npmClient'
        );

        expect(npmClientQuestion.default).toBe('npm');

        process.env.npm_config_user_agent = defaultClient;
    });

    test('validating install description', async () => {
        await createPWA();
        const questions = inquirer.prompt.mock.calls[0][0];
        const installQuestion = questions.find(
            question => question.name === 'install'
        );

        expect(
            installQuestion.message({ npmClient: 'npm' })
        ).toMatchInlineSnapshot(
            `"Install package dependencies with npm after creating project"`
        );
    });
});

test('should execute buildpack with answers provided', async () => {
    await createPWA();

    expect(execa.shell.mock.calls[0][0]).toMatchInlineSnapshot(
        `"BUILDPACK_LOCATION create-project test --name \\"test\\" --author \\"Gooston <gooston@goosemail.com>\\" --template \\"@magento/venia-concept@8.0.0\\" --backend-url \\"https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/\\" --backend-edition \\"AC\\" --braintree-token \\"sandbox_8yrzsvtm_s2bg8fs563crhqzk\\" --npm-client \\"yarn\\" --no-install"`
    );
});

test('should not include customBackendUrl in shell script', async () => {
    inquirer.prompt.mockResolvedValueOnce({
        customBackendUrl:
            'https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/',
        directory: 'test',
        name: 'test',
        author: 'Gooston <gooston@goosemail.com>',
        template: '@magento/venia-concept@8.0.0',
        backendUrl: '',
        braintreeToken: 'sandbox_8yrzsvtm_s2bg8fs563crhqzk',
        npmClient: 'yarn',
        install: false
    });

    await createPWA();

    expect(execa.shell.mock.calls[0][0]).toMatchInlineSnapshot(
        `"BUILDPACK_LOCATION create-project test --name \\"test\\" --author \\"Gooston <gooston@goosemail.com>\\" --template \\"@magento/venia-concept@8.0.0\\" --backend-url \\"https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/\\" --backend-edition \\"AC\\" --braintree-token \\"sandbox_8yrzsvtm_s2bg8fs563crhqzk\\" --npm-client \\"yarn\\" --no-install"`
    );
});

test('should log details', async () => {
    const log = jest.spyOn(console, 'log');

    await createPWA();

    expect(log.mock.calls).toMatchSnapshot();
});

test('should log error if project creation failed', async () => {
    const error = jest.spyOn(console, 'error');
    inquirer.prompt.mockRejectedValueOnce(false);

    await createPWA();

    expect(error.mock.calls).toMatchSnapshot();
});
