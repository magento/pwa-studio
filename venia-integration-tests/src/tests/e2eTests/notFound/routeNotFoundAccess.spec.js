import { notFoundPage as notFoundPageFixtures } from '../../../fixtures';

import { notFoundPage as notFoundPageAssertions } from '../../../assertions';

const { notFoundPage, notFoundMessage } = notFoundPageFixtures;

const { assertErrorInPage, assertNotFoundMessage } = notFoundPageAssertions;

describe('verify 404 page', () => {
    it(
        'user should be routed to 404 page when accessing an unknown route',
        { tags: ['@e2e', '@commerce', '@open-source', '@ci'] },
        () => {
            cy.viewport(1280, 1024);
            cy.visit(notFoundPage, { failOnStatusCode: false });

            assertErrorInPage();
            assertNotFoundMessage(notFoundMessage);
        }
    );
});
