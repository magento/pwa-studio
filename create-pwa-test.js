const childProcess = require('child_process');

const child = childProcess.spawn(
    'node',
    ['./packages/create-pwa/bin/create-pwa'],
    {
        env: {
            ...process.env,
            npm_config_user_agent: 'yarn'
        }
    }
);

const questions = {
    'Project root directory': {
        answer: 'test-pwa',
        answered: false
    },
    'Short name of the project to put in the package.json': {
        answer: 'test-pwa',
        answered: false
    },
    // 'Name of the author to put in the package.json': {
    //     answer: 'gooston <gooston@goosemail.com>',
    //     answered: false
    // },
    'Which template would you like to use to bootstrap': {
        answer: '@magento/venia-concept@latest',
        answered: false
    },
    'Magento instance to use as a backend': {
        // should go to the last option and enter a value
        answer: '',
        answered: false
    },
    'URL of a Magento instance to use as a backend': {
        answer: 'https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/',
        answered: false
    },
    'Braintree API token to use to communicate with your Braintree': {
        answer: 'sandbox_8yrzsvtm_s2bg8fs563crhqzk',
        answered: false
    },
    'NPM package management client to use': {
        // should go to the last option (yarn) and click enter
        answer: '',
        answered: false
    },
    'Install package dependencies with yarn after creating project': {
        answer: 'n',
        answered: false
    }
};

const getAnswerKey = question => {
    return Object.keys(questions).find(key => question.trim().includes(key));
};

child.stdout.on('data', data => {
    if (data) {
        const key = getAnswerKey(data.toString());
        if (key) {
            if (questions[key].answered) {
                return;
            } else {
                console.log(data.toString(), '\n\n', questions[key].answer);
                child.stdin.write(questions[key].answer);
                questions[key].answered = true;
            }
        } else {
            console.log(data.toString());
            child.stdin.write('\n');
        }
    }
});

child.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
});

child.on('close', () => {
    console.log('Child closed');
    console.log(JSON.stringify(questions, null, 2));
});
