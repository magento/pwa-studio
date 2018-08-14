(async env => {
    const fetch = require('node-fetch');

    const {
        // should always be magento-research
        CIRCLE_PROJECT_USERNAME,
        // should always be pwa-studio
        CIRCLE_PROJECT_REPONAME,
        // name of the branch _within the pwa-studio repo_...if it's from a
        // forked PRs, the temp branch in pwa-studio will just be 'pull/NNN'
        CIRCLE_BRANCH,
        // DangerCI token, because this is for DangerCI's benefit
        GH_TOKEN,
        // if these pull request vars are already populated
        // we probably don't need to do anything!
        CIRCLE_PULL_REQUEST,
        CIRCLE_PULL_REQUESTS,
        CIRCLE_PR_NUMBER,
        CIRCLE_PR_REPONAME,
        CIRCLE_PR_USERNAME,
        CI_PULL_REQUEST,
        CI_PULL_REQUESTS
    } = process.env;

    const repo = CIRCLE_PROJECT_REPONAME;
    const owner = CIRCLE_PROJECT_USERNAME;
    const branch = CIRCLE_BRANCH;
    const token = GH_TOKEN;

    // const pullRequest = {
    //     url:
    //         CIRCLE_PULL_REQUEST ||
    //         CIRCLE_PULL_REQUESTS ||
    //         CI_PULL_REQUEST ||
    //         CI_PULL_REQUESTS,
    //     prNumber: CIRCLE_PR_NUMBER,
    //     repo: CIRCLE_PR_REPONAME,
    //     owner: CIRCLE_PR_USERNAME
    // };

    // if (pullRequest.url) {
    //     console.log(`CircleCI has already populated pull request variables for this build; \`danger ci\` should run as expected.

    //     URL: ${pullRequest.url}
    //     Number: ${pullRequest.prNumber}
    //     `);
    //     process.exit(0);
    // }

    // if (pullRequest.owner !== owner || pullRequest.repo !== repo) {
    //     console.warn(`Some pull request environment variables are present, and others are not. DangerCI may not correctly identify this as a pull request. Check the environment setup step to see what variables CircleCI put in this build environment.

    //     Owner: ${pullRequest.owner} instead of ${owner}
    //     Repo: ${pullRequest.repo} instead of ${repo}

    //     `);
    // }

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

    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `bearer ${token}`
        },
        body: queryAndVariables
    });

    const responseBody = await response.text();

    try {
        const prs = JSON.parse(responseBody).data.repository.ref
            .associatedPullRequests.nodes;
        if (prs.length === 0) {
            return '';
        }
        const { url, number } = prs[0];
        return `
CI_PULL_REQUEST="${url}"
CI_PULL_REQUESTS="${url}"
CIRCLE_PULL_REQUEST="${url}"
CIRCLE_PULL_REQUESTS="${url}"
CIRCLE_PR_NUMBER="${number}"
`;
    } catch (e) {
        console.error(
            `Failed to find and export pull request variables. Check the environment setup step to see what env vars were provided.

        Request: ${queryAndVariables}

        Response: ${responseBody}
        `,
            e
        );
    }
})(process).then(
    out => {
        console.log(out);
    },
    e => {
        console.error('Failed to retrieve pull request from GitHub', e);
        process.exit(1);
    }
);
