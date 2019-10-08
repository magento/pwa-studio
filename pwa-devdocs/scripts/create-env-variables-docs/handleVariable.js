const {
  heading,
  text,
  paragraph,
  strong,
  inlineCode,
} = require('mdast-builder');

/**
 * A function for generating a markdown abstract syntax tree (mdast) structure
 * for a single environment variable definition
 *
 * @param {object} variable The environment variable data
 *
 * @returns {array} An array of mdast nodes containing the environment variable data
 */
const handleVariable = variable => {
  const {type, desc, example, default: defaultValue} = variable;
  let result = [];

  result.push(heading(3, inlineCode(variable.name)));

  result.push(paragraph([strong(text('Type:')), text(' '), inlineCode(type)]));

  // Include the default value if defined
  if (defaultValue) {
    result.push(
      paragraph([
        strong(text('Default:')),
        text(' '),
        inlineCode(defaultValue.toString()),
      ]),
    );
  }

  // Include the example if defined
  if (example) {
    result.push(
      paragraph([strong(text('Example:')), text(' '), inlineCode(example)]),
    );
  }

  result.push(paragraph([text(desc)]));

  return result;
};

module.exports = handleVariable;
