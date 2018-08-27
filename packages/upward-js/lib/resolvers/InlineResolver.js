const AbstractResolver = require('../AbstractResolver');
const { createArgumentValidator, Types } = require('./ParameterValidation');

class InlineResolver extends AbstractResolver {
    constructor({ inline }) {
        this.value = inline;
        this.isPrimitive = typeof inline !== 'object';
    }
    async register() {
        if (!this.isPrimitive) return this.params.inline;
    }
    async resolve(resolvedParams) {
        return this.isPrimitive ? this.value : resolvedParams;
    }
}

InlineResolver.prototype.validate = createArgumentValidator({
    inline: Types.any.isRequired
});

InlineResolver.telltale = 'inline';

module.exports = InlineResolver;
