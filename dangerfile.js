const { fail, danger, markdown, schedule, warn } = require('danger');
/**
 * TODO:
 *  - Replace danger env token in build with reference to aws param store after fixing credentials
 *  - Merge back with pwa-studio-cicd
 *  - Remove actor_id gate from webhook
 *  - switch danger-plugin-labels back to owner after they update the github api ref
 */

if (danger.github) {
    schedule(async function validatePrFilled() {
        // If any of these strings, pulled from the PR template, are found in the PR
        // description we should fail the PR as whomever opened it did not follow
        // ze rules.
        const failIfFound = [
            {
                text: 'TODO: Describe your changes in detail here.',
                location: 'Description'
            },
            { text: 'Closes #ISSUE_NUMBER', location: 'Related Issue' },
            { text: '1. Go to the FOO page.', location: 'Verification Steps' },
            {
                text:
                    'TODO: Please describe in detail how you tested your changes.',
                location: 'How Have YOU Tested this?'
            }
        ];

        failIfFound.forEach(({ text, location }) => {
            if (danger.github.pr.body.match(text)) {
                fail(
                    `Missing information in PR. Please fill out the "${location}" section.`
                );
            }
        });
    });

    schedule(async function validateIssueIsOpen() {
        const { github } = danger;
        const { owner, repo } = github.thisPR;

        const linkedIssue = danger.github.pr.body.match(/closes #([0-9]*)/i)[1];
        const { data } = await danger.github.api.issues.get({
            owner,
            repo,
            issue_number: linkedIssue
        });

        if (data.closed_at) {
            fail(
                `Issue ${linkedIssue} is closed. Please link a relevant open issue.`
            );
        }
    });

    schedule(async function checkVersionLabel() {
        const { github } = danger;

        const { owner, number: issue_number, repo } = github.thisPR;
        console.log(owner);
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
