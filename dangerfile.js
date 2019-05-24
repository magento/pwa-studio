const { fail, danger, markdown, schedule, warn } = require('danger');
const labels = require('danger-plugin-labels').default;

/**
 * TODO:
 *  - Replace danger env token in build with reference to aws param store after fixing credentials
 */

/**
 * Automatically applies labels for proposed change type from contributor
 */
schedule(labels({
  rules: [
    {
      match: /major \x28e.g x.0.0 - a breaking change\x29/i,
      label: "version: Major"
    },
    {
      match: /minor \x28e.g 0.x.0 - a backwards compatible addition\x29/i,
      label: "version: Minor"
    },
    {
      match: /patch \x28e.g 0.0.x - a bug fix\x29/i,
      label: "version: Patch"
    },
  ],
  validate: (labels) => {
    if (labels.length < 1) {
      fail('Please select a proposed changed type!');
      return false;
    } else if (labels.length > 1) {
      fail('Please select only one proposed changed type!');
      return false;
    }

    return true;
  }
}))
