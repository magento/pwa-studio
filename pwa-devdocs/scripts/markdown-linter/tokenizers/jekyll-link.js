/**
 * A remark-parse tokenizer to add support for jekyll style link definitions, which have spaces in the link
 *
 * For more information see:
 * - https://github.com/remarkjs/remark/tree/master/packages/remark-parse#extending-the-parser
 */
function jekyllLinkDefinition() {
    var Parser = this.Parser;
    var tokenizers = Parser.prototype.inlineTokenizers;
    var methods = Parser.prototype.inlineMethods;

    // Add a new inline tokenizer
    tokenizers.jekyllLinkDefinition = tokenizer;

    // Run it just before `link`.
    methods.splice(methods.indexOf('link'), 0, 'jekyllLinkDefinition');
}

// The tokenizer function to use during parsing
function tokenizer(eat, value, silent) {
    // This regex checks to see if a value looks like a markdown link definition
    var match = /^\[([^\]]+)\]:\s?(.*)/.exec(value);

    if (match) {
        if (silent) {
            return true;
        }

        // Create new definition node based on captured values
        // See: https://github.com/syntax-tree/mdast#definition
        let newNode = {
            type: 'definition',
            identifier: match[1],
            label: match[1],
            url: match[2]
        };

        // Consume the matching text from value (returns a function for adding a new node)
        // See: https://github.com/remarkjs/remark/tree/master/packages/remark-parse#eatsubvalue
        const add = eat(match[0]);

        // Add the new node to the currently processed node
        // See: https://github.com/remarkjs/remark/tree/master/packages/remark-parse#addnode-parent
        return add(newNode);
    }
}

// Add a locator for the tokenizer. This is required for inline tokenizers.
// See: https://github.com/remarkjs/remark/tree/master/packages/remark-parse#tokenizerlocatorvalue-fromindex
tokenizer.locator = (value, fromIndex) => {
    return value.indexOf('[', fromIndex);
};

module.exports = jekyllLinkDefinition;
