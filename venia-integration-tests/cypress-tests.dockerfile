FROM cypress/included:8.3.1 as cypress-included

# working directory
WORKDIR /usr/src/app/venia-integration-tests

# pick PR Instance build argument
ARG PR_INSTANCE_URL
ENV PR_INSTANCE_URL=$PR_INSTANCE_URL

# pick update snapshot argument
ARG UPDATE_SNAPSHOT
ENV UPDATE_SNAPSHOT=$UPDATE_SNAPSHOT

# install jq for updating json config file
RUN apt-get install jq -y

# set env variable for CI
ENV CI=true

# copy over the required files
COPY cypress ./cypress
COPY src ./src
COPY package.json yarn.lock ./
COPY cypress.config.json ./cypress.json

# update PR instance URL on which tests will run
RUN jq --arg PR_INSTANCE_URL $PR_INSTANCE_URL '.baseUrl = $PR_INSTANCE_URL' ./cypress.json > ./cypress.json.tmp && mv ./cypress.json.tmp ./cypress.json

# update snapshot updation env variable
RUN jq --arg UPDATE_SNAPSHOT $UPDATE_SNAPSHOT '.env.updateSnapshots = $UPDATE_SNAPSHOT' ./cypress.json > ./cypress.json.tmp && mv ./cypress.json.tmp ./cypress.json

# install dependencies with yarn
RUN yarn install --frozen-lockfile

# command to run tests
CMD ["sh", "-c", "CYPRESS_baseUrl=$PR_INSTANCE_URL yarn test:ci"]