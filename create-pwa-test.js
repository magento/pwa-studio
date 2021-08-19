const childProcess = require('child_process');

const child = childProcess.execFile('./packages/create-pwa/bin/create-pwa');

const questions = {
    'Project root directory': {
        answer: 'test-pwa',
        answered: false
    },
    'Short name of the project to put in the package.json': {
        answer: 'test-pwa',
        answered: false
    },
    'Name of the author to put in the package.json': {
        answer: 'gooston <gooston@goosemail.com>',
        answered: false
    },
    'Which template would you like to use to bootstrap': {
        answer: '@magento/venia-concept@latest',
        answered: false
    },
    'Magento instance to use as a backend': {
        // should go to the last option and enter a value
        answer: '\u001b[A',
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
        answer: '\u001b[A',
        answered: false
    },
    'Install package dependencies with yarn after creating project': {
        answer: 'n',
        answered: false
    }
};

const getAnswerKey = question => {
    return Object.keys(questions).find(key => question.includes(key));
};

child.stdout.setEncoding('utf8');
child.stdout.on('data', data => {
    const key = getAnswerKey(data);

    if (key) {
        if (questions[key].answered) {
            return;
        } else {
            console.log(data, '\n\n', questions[key].answer);

            child.stdin.write(questions[key].answer + '\n');
            questions[key].answered = true;
        }
    } else {
        child.stdin.write('\n');
    }
});

child.on('close', () => {
    console.log('Child closed');
});
