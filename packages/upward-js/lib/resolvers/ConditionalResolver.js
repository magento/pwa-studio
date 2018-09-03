const AbstractResolver = require('./AbstractResolver');

class ConditionalResolver extends AbstractResolver {
    static get resolverType() {
        return 'conditional';
    }
    static get telltale() {
        return 'when';
    }
    constructor(...args) {
        super(...args);
        if (this.params.when.length === 0) {
            throw new Error(
                `ConditionalResolver must have at least one matcher in its "when" list.`
            );
        }
        this.matchers = this.params.when.map(matcher =>
            this.makeMatcher(matcher)
        );
        this.matchers.push({
            doMatch() {
                return true;
            },
            use: this.params.default
        });
    }
    makeMatcher({ matches, pattern, use }) {
        const regex = new RegExp(pattern);
        return {
            matches,
            use,
            doMatch(matches) {
                return matches.match(regex);
            }
        };
    }
    matchesPropKey() {
        return `matches${this.matchIndex}`;
    }
    async resolve(deps) {
        const nextMatcher = this.params.matchers[this.matchIndex++];
        if (nextMatcher) {
            const propKey = deps.get(this.matchesPropKey());
            if (propKey)
                if (deps.get(this.matchesPropKey()))
                    return {
                        [this.matchesPropKey()]: nextMatcher.matches
                    };
        }
        const match = deps.get('match');
        if (match) {
            return match.use;
        }
        // const nextMatcher = this.params.matchers[this.matchIndex];
        // if (nextMatcher) {
        //     return {};
        // }
        return this.default;
    }
}

module.exports = ConditionalResolver;
