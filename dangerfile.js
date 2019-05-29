const { fail, danger, schedule, warn } = require('danger');

// Running `danger local` doesn't proxy the github API so gracefully exit.
if (danger.github) {
    schedule(async function verifyNoTodos() {
        if (danger.github.pr.body.match(/todo/i)) {
            warn(
                `Found the word "TODO" in the PR description. Just letting you know incase you forgot :)`
            );
        }
    });

    schedule(async function verifyPrFilled() {
        let failures = false;
        // This is a map of headers and the default contents. If a header is
        // missing or if the default content is still present we should fail as
        // this means the contributor either deleted the section or did not
        // fill it out.
        const rules = [
            {
                text: 'TODO: Describe your changes in detail here.',
                header: 'Description'
            },
            { text: 'Closes #ISSUE_NUMBER', header: 'Related Issue' },
            { text: '1. Go to the FOO page.', header: 'Verification Steps' },
            {
                text:
                    'TODO: Please describe in detail how you tested your changes.',
                header: 'How have YOU tested this?'
            }
        ];

        rules.forEach(({ text, header }) => {
            if (!danger.github.pr.body.match(`[#]+ ${header}`)) {
                fail(
                    `Missing "${header}" section. Please add it back, with detail.`
                );
                failures = true;
            }
            if (danger.github.pr.body.match(text)) {
                fail(
                    `Missing information in PR. Please fill out the "${header}" section.`
                );
                failures = true;
            }
        });

        if (failures) {
            markdown(
                'If your PR is missing information, check against the original template [here](https://raw.githubusercontent.com/magento-research/pwa-studio/develop/.github/PULL_REQUEST_TEMPLATE.md). At a minimum you must have the section headers from the template and provide some information in each section.'
            );
        }
    });

    schedule(async function verifyIssueIsOpen() {
        const { github } = danger;
        const { owner, repo } = github.thisPR;

        const linkedIssue = danger.github.pr.body.match(/closes #([0-9]*)/i)[1];

        if (!linkedIssue) {
            fail(
                'No linked issue found. Please link a relevant open issue by adding the text "closes #<issue_number>" in your PR.'
            );
        } else {
            const { data } = await danger.github.api.issues.get({
                owner,
                repo,
                issue_number: linkedIssue
            });

            if (data.closed_at) {
                fail(
                    `Issue ${linkedIssue} is closed. Please link a relevant open issue by adding the text "closes #<issue_number>" in your PR.`
                );
            }
        }
    });

    schedule(async function checkVersionLabel() {
        const { github } = danger;

        const { owner, number: issue_number, repo } = github.thisPR;
        const { data } = await github.api.issues.listLabelsOnIssue({
            owner,
            repo,
            issue_number
        });

        const existingLabels = data.map(({ name }) => name);
        const versionLabels = [
            'version: Major',
            'version: Minor',
            'version: Patch'
        ];

        const hasVersionLabel = existingLabels.some(label => {
            if (versionLabels.includes(label)) {
                return true;
            }
        });

        if (!hasVersionLabel) {
            fail('A version label is required. A maintainer must add one.');
        }
    });

    schedule(async function addProjectLabels() {
        const { git, github } = danger;
        const allChangedFiles = [
            ...git.created_files,
            ...git.deleted_files,
            ...git.modified_files
        ];
        const touchedPackages = allChangedFiles.reduce((touched, path) => {
            const matches = path.match(/packages\/([\w-]+)\//);
            return matches ? touched.add(matches[1]) : touched;
        }, new Set());

        if (!touchedPackages.size) return;
        const { owner, number: issue_number, repo } = github.thisPR;

        const { data } = await github.api.issues.listLabelsOnIssue({
            owner,
            repo,
            issue_number
        });

        const newlabels = Array.from(touchedPackages).map(s => `pkg:${s}`);
        const existingLabels = data.map(({ name }) => name);

        await github.api.issues.replaceLabels(
            Object.assign(
                {},
                {
                    issue_number,
                    labels: newlabels.concat(existingLabels),
                    owner,
                    repo
                }
            )
        );
    });
}
