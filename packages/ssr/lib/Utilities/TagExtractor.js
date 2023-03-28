/**
 * Utility class for extracting X-Magento-Tags for graphql entities
 */
class TagExtractor {
    /**
     *
     * @param {any} apolloState
     * @param {object} options
     * @param {string} options.generalTags
     * @param {TagDefinition[]} options.tagDefinitions
     * @param {string} options.url
     */
    constructor(apolloState, options) {
        const { generalTags = [], tagDefinitions = [], url } = options;
        this.apolloState = apolloState;
        this.tagDefinitions = tagDefinitions;
        this.generalTags = generalTags;
        this.entries = this._createEntries(apolloState);

        const pathname = url && url.replace(/^\//, '').replace(/\?.*$/, '');

        // Set current page type
        const entityUrl = this.entries.find(
            entry =>
                entry.__typename === 'EntityUrl' &&
                (!pathname || entry.relative_url === pathname)
        );
        this.pageType = entityUrl ? entityUrl.type : null;
    }

    /**
     *
     * @returns {string} Magento tags concatenated
     */
    extractAllTags() {
        return (
            this.generalTags.join(',') +
            this.tagDefinitions
                .map(this._extractTagsForType.bind(this))
                .reduce((acc, curr) => (curr ? acc + ',' + curr : acc), '')
        );
    }

    /**
     *
     * @param {TagDefinition} tagDefinition
     * @returns {string}
     */
    _extractTagsForType(tagDefinition) {
        const {
            tagPrefix,
            typenames,
            field = 'id',
            pageType = null,
            resolver
        } = tagDefinition;

        if (pageType && this.pageType !== pageType) {
            return '';
        }

        if (resolver) {
            return resolver(this.apolloState);
        }

        const tags = this.entries
            .filter(
                entry =>
                    entry.__typename && typenames.includes(entry.__typename)
            )
            .map(entry => tagPrefix + '_' + entry[field])
            .join(',');

        return tags;
    }

    /**
     * Reduces all entities in Apollo Cache to an array
     *
     * @param {object} apolloState
     * @returns {array}
     */
    _createEntries(apolloState) {
        const entries = Array.from(Object.values(apolloState));

        let rootQueryEntries = [];
        let rootQueryNestedEntries = [];
        if (apolloState['ROOT_QUERY']) {
            // Some entities are not present as individual entries in cache, but in ROOT_QUERY field
            rootQueryEntries = Object.values(apolloState['ROOT_QUERY']);

            // Some entities are inside ROOT_QUERY/.../items array
            rootQueryNestedEntries = rootQueryEntries.reduce(
                (acc, curr) =>
                    curr.items && curr.items.length
                        ? [...acc, ...curr.items]
                        : acc,
                []
            );
        }

        return [...entries, ...rootQueryEntries, ...rootQueryNestedEntries];
    }
}

/**
 * @typedef TagDefinition
 *
 * @property {string[]} tagPrefix
 * @property {string} pageType
 * @property {string} typenames
 * @property {string} field
 *
 */

module.exports = TagExtractor;
