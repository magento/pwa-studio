/**
 * Patch the CircleCI build environment to fix a known problem with DangerCI
 * recognizing some pull requests in CircleCI.
 *
 * http://danger.systems/js/guides/faq.html#circle-ci-doesnt-run-my-build-consistently
 *
 * If you are a contributor to pwa-studio with access to the
 * magento-research/pwa-studio repo directly, you can push new branches to it
 * and open pull requests without having to fork to your personal account.
 *
 * However, if CircleCI is configured to run builds for every branch, whether
 * it is a pull request or not, then it will initiate a build for a pushed
 * branch before you have the chance to open a pull request on it. After you
 * have opened the pull request, CircleCI will continue to reuse the previous
 * environment it made for the branch before it became a PR. This is a defect
 * that CircleCI is tracking:
 *
 * https://discuss.circleci.com/t/pull-requests-not-triggering-build/1213
 *
 * DangerCI identifies pull requests in different CI environments by examining
 * environment variables the CI system sets in the build container. Its
 * CircleCI provider:
 * https://github.com/danger/danger-js/blob/master/source/ci_source/providers/Circle.ts
 *
 * looks for CI_PULL_REQUEST, CIRCLE_PULL_REQUEST, or CIRCLE_PR_NUMBER
 * env vars. If it can't find them, then it assumes the build is not a pull
 * request, and it doesn't run. Therefore, because of the CircleCI reuse of
 * build containers, a non-fork branch that already built before it was a PR
 * will never have those environment variables properly set.
 *
 * This script uses the GitHub API to populate those variables if necessary.
 *
 * This script is configured to run by `./circle/config.yml` as a separate step
 * prior to DangerCI; you shouldn't need to manually trigger it or run it
 * locally.
 *
 * @author James Zetlen
 * August 2018
 * (Please delete this with gusto as soon as you can)
 */
async function patchEnvironment({ env, setEnv, log }) {
    const fetch = require('node-fetch');

    const {
        // should always be magento-research
        CIRCLE_PROJECT_USERNAME,
        // should always be pwa-studio
        CIRCLE_PROJECT_REPONAME,
        // name of the branch _within the pwa-studio repo_...if it's from a
        // forked PRs, the temp branch in pwa-studio will just be 'pull/NNN'
        CIRCLE_BRANCH,
        // The DangerCI token should have the `repo:` permissions we need.
        DANGER_GITHUB_API_TOKEN,
        // Github API URL must be passed in via env
        GITHUB_GRAPHQL_ENDPOINT,
        // if these pull request vars are already populated
        // we probably don't need to do anything!
        CIRCLE_PULL_REQUEST,
        CIRCLE_PULL_REQUESTS,
        CIRCLE_PR_NUMBER,
        CIRCLE_PR_REPONAME,
        CIRCLE_PR_USERNAME,
        CI_PULL_REQUEST,
        CI_PULL_REQUESTS
    } = env;

    const repo = CIRCLE_PROJECT_REPONAME;
    const owner = CIRCLE_PROJECT_USERNAME;
    const branch = CIRCLE_BRANCH;
    const token = DANGER_GITHUB_API_TOKEN;

    const pullRequest = {
        url:
            CIRCLE_PULL_REQUEST ||
            CIRCLE_PULL_REQUESTS ||
            CI_PULL_REQUEST ||
            CI_PULL_REQUESTS,
        prNumber: CIRCLE_PR_NUMBER,
        repo: CIRCLE_PR_REPONAME,
        owner: CIRCLE_PR_USERNAME
    };

    if (!GITHUB_GRAPHQL_ENDPOINT) {
        log(`No GITHUB_GRAPHQL_ENDPOINT present in environment.
Cannot call GitHub to populate missing PR variables.`);
    }

    if (!DANGER_GITHUB_API_TOKEN) {
        log(`No DANGER_GITHUB_API_TOKEN present in environment.
Cannot call GItHub to populate missing PR variables.`);
    }

    if (pullRequest.url) {
        log(
            `No change: CircleCI has already populated pull request variables
for this build, so 'danger ci' should run as expected.

Pull Request: ${pullRequest.url} from ${pullRequest.owner}`
        );
        return;
    }

    if (pullRequest.owner || pullRequest.repo) {
        log(
            `Some pull request environment variables are present, and others
are not. DangerCI may not correctly identify this as a pull request. Check the
CircleCI "Spin up environment" step to see build environment variables.

        Pull request from: ${pullRequest.owner}/${pullRequest.repo}
        instead of:        ${owner}/${repo}

`
        );
    }

    // Get a Git ref (in this case the branchname) from the master repository.
    // The Git GraphQL API has a list of `associatedPullRequests` on that ref.
    // If a local (non-forked) PR exists, it should be here.
    // If there is more than one, just use the latest.
    const query = `query getPR($owner: String!, $name: String!, $ref: String!) {
        repository(owner: $owner, name: $name) {
          ref(qualifiedName: $ref) {
            associatedPullRequests(last: 1) {
              nodes {
                url
                number
              }
            }
          }
        }
      }
      `;

    const queryAndVariables = JSON.stringify(
        {
            query,
            variables: {
                owner,
                name: repo,
                ref: `refs/heads/${branch}`
            }
        },
        null,
        2
    );

    let response;
    try {
        response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
                Authorization: `bearer ${token}`
            },
            body: queryAndVariables
        });
    } catch (e) {
        log(`Failed to contact GitHub API: ${e.toString()}`);
        return;
    }

    // For debugging purposes, obtain response text before JSON parse,
    // so we can inspect it if necessary.
    const responseBody = await response.text();

    try {
        if (response.status > 399) {
            throw new Error(`HTTP ${response.status}`);
        }

        // If this exact structure is not present, we don't know what to do,
        // so we fall through to the catch clause.
        const prs = JSON.parse(responseBody).data.repository.ref
            .associatedPullRequests.nodes;

        if (prs.length === 0) {
            log(`Found no pull requests on GitHub for ${branch}.`);
            return;
        }

        const { url, number } = prs[0];
        // Since it is a PR, print out some bash script that will set these
        // environment variables with the data GitHub gave us.
        // In `.circleci/config.yml`, we use a technique documented by Circle
        // here:
        // https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-shell-command
        // and append this to the script located at $BASH_ENV.
        // This ought to make Danger see the build as a pull request.
        const newVars = `
CI_PULL_REQUEST="${url}"
CI_PULL_REQUESTS="${url}"
CIRCLE_PULL_REQUEST="${url}"
CIRCLE_PULL_REQUESTS="${url}"
CIRCLE_PR_NUMBER="${number}"
`;
        log(
            'Acquired missing pull request data from GitHub. This is PR #' +
                number +
                `.\n URL: ${url}. Added environment variables:\n${newVars}`
        );
        setEnv(newVars);
    } catch (e) {
        log(
            `Failed to find and export pull request variables using the GitHub
API. Check the environment setup step to see what env vars were provided.

Request: ${queryAndVariables}

Response: ${responseBody}

${e.toString()}
`
        );
    }
}

module.exports = patchEnvironment;
