(async env => {
    const fetch = require('node-fetch');

    const repo = process.env.CIRCLE_PROJECT_REPONAME;
    const owner = process.env.CIRCLE_PROJECT_USERNAME;
    const branch = process.env.CIRCLE_BRANCH;
    const token = process.env.GH_TOKEN;

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
        throw new Error(`
Request: ${queryAndVariables}

Response: ${responseBody}`);
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
