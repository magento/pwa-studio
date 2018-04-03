# Contributing

Thank you for your interest in contributing to the pwa-devdocs project! Before you start contributing, please take a moment to read through the following guidelines:

* [Code of Conduct]
* [Support]

To contribute to this repository, start by forking the [official repository] and following the Installation instructions in the README file.

## Submit changes

All Pull Requests should be done against the `develop` branch. This allows us to review and merge your changes prior to publication.

 **Do not submit PR's against the `master` branch.** This branch reflects the published content on the documentation site.

To help with reviews, your PR should only create/revise a single topic or fix a single issue.

To maintain a clean URL structure, every topic file must be created in its own directory and named `index.md`. See the current directory structure for examples.

It is okay to have multiple commits in your PR. These will be squashed by GitHub prior to merging with `develop`.

If your PR addresses an existing issue, please reference that issue in the title or description.

### Style guide

As much as possible, please follow the [Google Developer Documentation Style Guide] when you are writing content.

Use [Kramdown]-flavored markdown wherever possible. HTML should be used only in the most dire of circumstances.

For commit messages, follow the conventions described in [How to Write a Git Commit Message].

## Report a bug

Create a GitHub issue and put an **X** in the **Bug** box to report a bug found on the documentation website or with the project itself.

Examples of bugs include:
* Editorial mistakes (e.g. spelling, grammar, punctuation)
* Incorrect information
* Broken link
* Missing image
* Weird formatting

**DO NOT** create GitHub issues asking for help on bugs in your project or other support-type questions.

## Request a topic/clarification

If you feel that there is a gap in our documentation, create a GitHub issue and put an **X** in the **New Topic Request** or **Topic Clarification Request** box.

Please provide as much detail and context in the description to help us understand the request. We will do our best to provide the appropriate content.

## Request a feature

Is there a feature you would like to see in our documentation site? Maybe you saw a neat way of presenting information or code to the reader. 

Let us know, by creating a GitHub issue and marking **New Feature Request**. Provide a detailed description of what you would like to see on the docs site and we will see what we can do!

[Code of Conduct]: CODE_OF_CONDUCT.md
[Support]: SUPPORT.md
[Google Developer Documentation Style Guide]: https://developers.google.com/style/
[official repository]: https://github.com/magento-research/pwa-devdocs
[How to Write a Git Commit Message]: https://chris.beams.io/posts/git-commit/
[Kramdown]: https://kramdown.gettalong.org/