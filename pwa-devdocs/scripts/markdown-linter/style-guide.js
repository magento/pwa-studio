module.exports.plugins = [
    require('remark-lint'),
    require('remark-frontmatter'),

    // Blockquotes must be indented twice
    [require('remark-lint-blockquote-indentation'), [1, 2]],
    // Code blocks need to be fenced, not indented
    [require('remark-lint-code-block-style'), [1, 'fenced']],
    // Definitions must be in lowercase
    require('remark-lint-definition-case'),
    // No consecutive white spaces between definitions
    require('remark-lint-definition-spacing'),
    // Use underscore for emphasis
    [require('remark-lint-emphasis-marker'), [1, '_']],
    // Fenced code blocks must have a language associated with it
    require('remark-lint-fenced-code-flag'),
    // Use backticks (`) for code fences
    [require('remark-lint-fenced-code-marker'), [1, '`']],
    // Markdown files must use the 'md' file extension
    require('remark-lint-file-extension'),
    // Definitions must be placed at the end of the file
    require('remark-lint-final-definition'),
    // Files must have a newline at the end for consistency/predictability
    // See: https://unix.stackexchange.com/questions/18743/whats-the-point-in-adding-a-new-line-to-the-end-of-a-file
    require('remark-lint-final-newline'),
    // Headings start at level 2
    [require('remark-lint-first-heading-level'), [1, 2]],
    // Headings should increment sequentially
    require('remark-lint-heading-increment'),
    // Use 'atx' style headings
    [require('remark-lint-heading-style'), [1, 'atx']],
    // Use double quotes for link title styles
    [require('remark-lint-link-title-style'), [1, '"']],
    // Do not indent bullets
    require('remark-lint-list-item-bullet-indent'),
    // Do not use mixed indentations in lists
    require('remark-lint-list-item-content-indent'),
    // Use tab-size to separate list bullet and content
    require('remark-lint-list-item-indent'),
    // Headers should be limited to 60 characters
    [require('remark-lint-maximum-heading-length'), [1, 60]],
    // Block quotes require a marker on blank lines
    require('remark-lint-no-blockquote-without-marker'),
    // No consecutive blank lines
    require('remark-lint-no-consecutive-blank-lines'),
    // No duplicate definitions
    require('remark-lint-no-duplicate-definitions'),
    // No duplicate headings in the same heading section
    require('remark-lint-no-duplicate-headings-in-section'),
    // Do not use emphasis as a paragraph heading
    require('remark-lint-no-emphasis-as-heading'),
    // Do not use empty url links
    require('remark-lint-no-empty-url'),
    // Do not start filenames with an article
    require('remark-lint-no-file-name-articles'),
    // No consecutive dashes in file names
    require('remark-lint-no-file-name-consecutive-dashes'),
    // No irregular characters in file names
    require('remark-lint-no-file-name-irregular-characters'),
    // No mixed case file names
    require('remark-lint-no-file-name-mixed-case'),
    // No outer dashes in file names
    require('remark-lint-no-file-name-outer-dashes'),
    // Use a single space to indent headings
    require('remark-lint-no-heading-content-indent'),
    // No heading level greater than 6
    require('remark-lint-no-heading-like-paragraph'),
    // Do not punctuate headings
    require('remark-lint-no-heading-punctuation'),
    // Do not add padding to inline markdown nodes
    require('remark-lint-no-inline-padding'),
    // Use angle brackets for literal URLs
    require('remark-lint-no-literal-urls'),
    // Use blank lines to separate content blocks
    require('remark-lint-no-missing-blank-lines'),
    // Do not indent paragraph content
    require('remark-lint-no-paragraph-content-indent'),
    // Do not use reference ids as URL
    require('remark-lint-no-reference-like-url'),
    // Use trailing [] on image references
    require('remark-lint-no-shortcut-reference-image'),
    // Use trailing [] on link references
    require('remark-lint-no-shortcut-reference-link'),
    // Use spaces instead of hard tabs
    require('remark-lint-no-tabs'),
    // All references must have a definition
    require('remark-lint-no-undefined-references'),
    // All definitions must be referenced
    require('remark-lint-no-unused-definitions'),
    // List item markers must use '.'
    [require('remark-lint-ordered-list-marker-style'), [1, '.']],
    // Use '---' for horizontal rules
    [require('remark-lint-rule-style'), [1, '---']],
    // Use '**' as a strong marker
    [require('remark-lint-strong-marker'), [1, '*']],
    // Use a minus ('-') for unordered lists
    [require('remark-lint-unordered-list-marker-style'), [1, '-']]
];
