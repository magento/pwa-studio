# Contributing

Thank you for your interest in contributing to the PWA Studio project! Before you start, please take a moment to read through the following guidelines:

-   [Code of Conduct]
-   [Support]

To contribute to this repository, fork the [official repository] and follow the installation instructions in the `README` file.

## Pull Requests

-   Every PR must be tied to an issue. Create an issue if none exist for the PR.
-   PRs should only be scoped to a single issue.
-   PR commits should contain [meaningful commit messages].
-   Please fill out the entirety of the PR template, including the PR checklist.
-   If your PR adds a feature with a public API, please add or update documentation in the README for the relevant package.

**Note:**
_As a developer, please write developer-facing documentation in README or other Markdown files in the relevant package files. Do not add documentation directly to the `pwa-devdocs` folder. That folder is maintained by the Technical Writing team, who will revise and proofread your documentation and migrate it to the devdocs site._

## Contribution process

Magento maintains a public roadmap for this and other repositories in each project's issue board.

Any and all community participation in this backlog is encouraged and appreciated.
Even foundational infrastructure stories are available for a generous developer to take on.

To get started, look for issues tagged with the **[help wanted]** labels.
These issues are ready for community ownership.

### Claiming an issue on the roadmap

If you are interested in taking ownership of a roadmap feature or issue, we ask that you go through the following process.
This helps us organize and forecast the progress of our projects.

#### Step 1: Add an issue comment

Add a comment on an issue expressing your interest in taking ownership of it.
Make sure your GitHub profile includes an email address so we can contact you privately.

#### Step 2: Meet with a maintainer

A maintainer will contact you and ask to set up a real-time meeting to discuss the issue you are interested in owning.
This meeting can be in person, video chat, audio chat, or text chat.

In general this meeting is brief but can vary with the complexity of an issue.
For larger issues, we may schedule follow-up meetings.

During this meeting, we provide you with any additional materials or resources you need to work on the issue.

#### Step 3: Provide an estimate

We ask that you provide us an estimate of how long it will take you to complete the issue.

If you require more time to provide a time frame for completion, you are allowed to take up to five business days to think about it.

If you can't get back to us by that time, we understand!
As a community developer, you are helping us out in addition to your regular job.
We will un-assign you from this issue, but please feel free to contribute to another issue.

#### Step 4: Work on the issue

After you provide an estimate, the issue is now "in progress".

If you need more time to work on the issue, please contact us as soon as possible.
We may request an update on your progress, but we are willing to accommodate.

If the deadline you provided to us passes and we have not heard from you, we will wait one week before un-assigning you from the issue.

#### Step 5: Create a pull request

When you finish working on an issue, create a pull request with the issue number included in the title or body.
This starts the (brief) code review process.

After we accept and merge your contribution, you become an official contributor!
Official contributors are invited to our backlog grooming sessions and have direct influence over the product roadmap.

We hope this guide paints a clear picture of your duties and expectations in the contribution process. Thank you in advance for helping with our research projects!

## Report an issue

Create a [GitHub issue].
Provide as much detail as you can in each section to help us triage and process the issue.

### Issue types

-   Bug - An error, flaw, or failure in the code
-   Feature suggestion - A missing feature you would like to see implemented in the project
-   Other - Any other type of task related to the project

### Definition of Done

- Addresses open issue
  - Meets listed acceptance criteria
  - Key stakeholder approves (original issue author, product / business / QA / UX)
- **Documentation** plays an important role in an open-source library project such as PWA Studio.

  The following changes require documentation:

  - **Public API** -
    API documentation provide reference information and examples to help developers understand how to use the PWA Studio library.
    Most of this documentation comes from JSDoc blocks in the source code, so
    changes that add or modify the public API also require JSDoc block changes.

  - **New project concepts** -
    Conceptual topics provide background knowledge to help developers understand how the different technologies come together.
    If a change or feature requires a developer to learn a new pattern, design, or process, then that information needs to be documented.
    Examples of project concepts include: UPWARD, scaffolding, and project configuration.
  
  - **Code functionality** -
    Documentation is required when major changes happen in the project codebase that affect how the code works.
    Communicating these changes help maintainers and early adopters keep up with the project.
    These docs often take the form of release notes.

- Test coverage:
  - Unit tests & some integrations in Jest
  - Current MFTF test cases pass (not additional ones)
- Coding standards:
  - Code passes all linting steps, adhering to code format and patterns
  - Code does not violate [PWA Studio coding standards and best practices](https://github.com/magento/pwa-studio/wiki/Project-coding-standards-and-conventions)
  - Minimum number of reviewers for a major change should be 2
  - Minimum number of reviewers for a minor change should be 1
  - Minimum number of reviewers for a hotfix/patch should be 1, and that 1 must be the tech lead

  
**Note:**
_Please avoid creating GitHub issues asking for help on bugs in your project that are outside the scope of this project._

[code of conduct]: CODE_OF_CONDUCT.md
[support]: SUPPORT.md
[official repository]: https://github.com/magento/pwa-studio
[meaningful commit messages]: https://chris.beams.io/posts/git-commit/
[github issue]: https://github.com/magento/pwa-studio/issues/new/choose
[help wanted]: https://github.com/magento/pwa-studio/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22
