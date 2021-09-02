# FROM cypress/browsers:node12.18.3-chrome89-ff86 as cypress-browsers
# docker pull cypress/included:7.0.0
FROM cypress/included:8.3.1 as cypress-included
# working directory
WORKDIR /usr/src/app

# pick build argument and give default value
ARG PR_INSTANCE_URL
ENV PR_INSTANCE_URL=$PR_INSTANCE_URL

RUN apt-get install jq -y

# set env variable for CI
ENV CI=true

# copy over the venia-integration-tests package
COPY venia-integration-tests ./venia-integration-tests

# update PR instance URL on which tests will run
RUN jq --arg PR_INSTANCE_URL $PR_INSTANCE_URL '.baseUrl = $PR_INSTANCE_URL' ./venia-integration-tests/cypress.config.json > ./venia-integration-tests/cypress.json

WORKDIR /usr/src/app/venia-integration-tests

# install dependencies with yarn
RUN yarn install --frozen-lockfile

# command to run tests
CMD ["sh", "-c", "CYPRESS_baseUrl=$PR_INSTANCE_URL yarn test:headless"]
