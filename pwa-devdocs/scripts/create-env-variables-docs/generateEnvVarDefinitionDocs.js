const fs = require('fs');
const {root} = require('mdast-builder');
const unified = require('unified');
const stringify = require('remark-stringify');
const handleSection = require('./handleSection');

/**
 * A function for generating markdown content from an envVarDefinitions file
 *
 * @param {string} filepath The filepath to the envVarDefinitions file
 *
 * @returns {string} A markdown formatted string containing documentation from data in the envVarDefinitions file
 */
module.exports = filepath => {
  const fileContent = JSON.parse(fs.readFileSync(filepath));

  const {sections} = fileContent;

  let tree = root([]);

  sections.forEach(section => {
    tree.children = tree.children.concat(handleSection(section));
  });

  const processor = unified().use(stringify, {});

  const result = processor.stringify(tree);

  return result;
};
