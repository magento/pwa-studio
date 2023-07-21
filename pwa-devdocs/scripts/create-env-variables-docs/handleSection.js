const {heading, text} = require('mdast-builder');
const handleVariable = require('./handleVariable');

/**
 * Function for handling a section of the envVarDefinition file
 *
 * @param {object} section An object containing section data such as its name and its variable definitions
 *
 * @returns {Array} An array of markdown abstract syntax nodes containing the section and variable data
 */
const handleSection = section => {
  const {name, variables} = section;
  let result = [heading(2, text(name))];

  variables.forEach(variable => {
    result = result.concat(handleVariable(variable));
  });

  return result;
};

module.exports = handleSection;
