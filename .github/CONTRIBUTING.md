# Contributing

Thank you for your interest in contributing to the PWA Studio project!

Before you start, please take a moment to read through the following guidelines:

-   [Code of Conduct][]
-   [Support][]

## Terms

**Core Team**
: The Magento core engineering/product team working on the PWA Studio project.

**Community Maintainer**
: A community point of contact approved by the Core Team to help with project administration.

Current list of maintainers:

-   [Jordan Eisenburger](https://github.com/Jordaneisenburger)

**Community Advisory Board**
: Consists of Community Maintainer(s) and Core Team members who help drive prioritization and scoping for community driven **help wanted** features and enhancements.

**Directly Responsible Individual**
: The assigned developer for a specific issue.
This person is responsible for ensuring the issue is completed in a reasonable amount of time and to a certain standard.

## Ways to contribute

-   [Identify and create issues](#identify-and-create-issues)
-   [Select a groomed issue](#select-a-groomed-issue)
-   [Help answer community questions](#help-answer-community-questions)

### Identify and create issues

If you encounter an issue while using PWA Studio or you have a suggestion for a new feature, let us know by [creating an issue][].
Provide as much detail as you can to help us reproduce or analyze the issue before prioritizing it.

When the issue is created, it is placed in the **Backlog** column of the [Community Backlog][] project.
Contact someone from the Community Advisory Board to bring the issue to our attention and we will add the **help wanted** label to it.

_Please avoid creating GitHub issues asking for help on bugs in your own project that are outside the scope of this project._

#### Grooming new issues

Every week, the Community Advisory Board meets to look at the **Backlog** column of the Community Backlog project.
The board grooms the backlog issues and moves issues that are well-defined and has value to the **Prioritized** column.

If an issue does not provide enough details or provides no value, we will leave a comment and give you an opportunity to respond.
If there is no response before the next grooming session, the issue is closed.

### Select a groomed issue

The main way to contribute to the project is by working on an issue.
Look through the **Prioritized** column in the [Community Backlog][] for issues that are available for you to work on.

_Do not attempt to work on something unrelated to the issues inside the **Prioritized** column._

If you see an issue you would like to work on in the **Prioritized** column, notify a Community Maintainer in the issue comments (by using @) to let them know you are interested.
The Community Maintainer will follow up with you to make sure you understand the scope of the changes being asked for in the issue.

After the Community Maintainer assigns the issue to you, it is moved to the **In Progress** column of the [Community Backlog][] to prevent others from picking up the issue.

#### Working on the solution

As a contributer, you should familiarize yourself with the project's [coding standards and conventions][].

The issue will provide you with guidance for what we think the solution should look like.
If you are unsure about anything, reach out to anyone in the Community Advisory Board and we will provide more details.

To get your contribution accepted, you must sign [Adobe's Contributor License Agreement (CLA)](https://opensource.adobe.com/cla.html).
You only need to sign the CLA once.

#### Testing your solution

We require tests be provided with any contributions - please add or update tests
to ensure your changes are covered. We're happy to work with you and to provide
tests for your contributions in the event that you are unable to do so yourself.

If you want to check test coverage locally, you can use the `--testPathPattern`
and `--collectCoverageFrom` Jest arguments. Otherwise, wait for the CI tooling
to report back in your PR on the test status/coverage.

If you modified the `useCategoryTree` talon you would run the following command
to check tests and coverage:

```sh
yarn test --testPathPattern="useCategoryTree" --collectCoverageFrom="**/useCategoryTree**"
```

#### PR review process

After you submit your PR, the Community Advisory Board will assign one or more reviewers to look over your solution and ensure quality and adherence to standards.
As the Directly Responsible Individual for the issue, you are expected to address all feedback before the issue is sent to our QA and merged.

If at any point in the review cycle you have commitments preventing you from addressing feedback, or
if there is a suggestion you do not understand, please let us know!
We are happy to pair program or complete those changes for you to help push the PR across the finish line.

If you would like to do a demo of your PR at our weekly community sync on Fridays, let a Community Maintainer know so you can be added to the schedule.

### Help answer community questions

Another way to help contribute to this project is to help answer community questions about PWA Studio.

Our community is growing every day, and people are evaluating or trying out PWA Studio for the first time.
Join our [#pwa Slack channel][] and help out fellow community members with their questions or share your experiences working with PWA Studio!

[code of conduct]: CODE_OF_CONDUCT.md
[support]: SUPPORT.md
[community backlog]: https://github.com/magento/pwa-studio/projects/3
[#pwa slack channel]: https://magentocommeng.slack.com/archives/C71HNKYS2
[creating an issue]: https://github.com/magento/pwa-studio/issues/new/choose
[coding standards and conventions]: https://github.com/magento/pwa-studio/wiki/Project-coding-standards-and-conventions
