# Create release notes for PWA Studio

Here are the steps you need to follow to create PWA Studio release notes. :

**PART 1: Code repo tasks** (`magento/pwa-studio`):

1. Clone the `magento/pwa-studio` repo.
2. Create a `release-notes` branch.
3. Login to the Adobe network using VPN as necessary.
4. Run the JitNotes CLI.
5. Update the `magento-compatibility.js` file.
6. Create a PR.
7. Generate and copy the source-code docs.

**PART 2: Docs repo tasks** (`AdobeDocs/commerce-pwa-studio`):


1. Clone the `AdobeDocs/commerce-pwa-studio` repo.
2. Create a `release` branch from `main`.
3. Replace auto-generated docs.
4. Verify changes.
5. Create a PR.
6. Fix markdown linting errors.
7. Merge PR to `main`.

**PART 3: Deploy docs to production**

1. From the GitHub AdobeDocs/commerce-pwa-studio repo, access the **Deployment** workflow from the **Actions** tab.

2. Run the workflow with a production configuration.

## PART 1: Code repo tasks (`magento/pwa-studio`)

1. Clone the `magento/pwa-studio` repo:

   ```bash
   git clone git@github.com:magento/pwa-studio.git
   ```

2. CD into the project and run `yarn` to install the dependencies:

   ```bash
   cd pwa-studio
   yarn
   ```

3. Add a new `release-notes` branch based off the `release/xx.x` branch. Example: `release-notes/13.1`.

4. Login to the Adobe network or access it using the GlobalProtect VPN.

   **NOTE**: You must be logged in to the Adobe network to run the JitNotes CLI.

5. Run the [JitNotes CLI](https://github.com/AdobeDocs/jitnotes) from the `pwa-studio` root:

   ```bash
   npx jitnotes
   ```

   This command generates a new `CHANGELOG.md` in the project's root to replace the existing one.

6. Add relevant content to the following sections of the `CHANGELOG.md`:

   - **Documentation changes**
   - **Known issues**
   - **Updated package dependencies** table.

   **NOTE**: You may also need to add release note entries to the Jira ticket's **Release note** field if they are shown as missing in the CHANGELOG.

7. From your `magento/pwa-studio` project root, update the `magento-compatibility.js` file.

   This file is used by the docs script to create the `markdown-compatibility.md` table for the PWA Studio documentation.

   ````diff
   module.exports = {
   +  '13.1.0': '2.4.6',
      '13.0.0': '2.4.5',
      '12.7.0': '2.4.5',
   ````

8. Commit and push your changes, then create a PR for approval. Example PR: https://github.com/magento/pwa-studio/pull/4080.

9. CD into the `pwa-studio/pwa-devdocs` directory and run the following command:

   ```bash
   yarn build:docs
   ```

   This command generates the following markdown files:

   - `magento-compatibility.md`
   - JSDoc source-code markdown from the following directories:

     ```tree
     root
     └── packages
        ├── buildpack
        ├── pagebuilder
        ├── peregrine
        ├── pwa-buildpack
        └── venia-ui
     ```

10. Open the `auto-generated` directory to verify the generated files:

    ```tree
    pwa-devdocs
    └── src
       └── _includes
          └── auto-generated
             ├── pagebuilder
             ├── peregrine
             ├── pwa-buildpack
             ├── venia-ui
             └── magento-compatibility.md
    ```

11. Copy the `auto-generated` directory, with all its subdirectories and files.

## PART 2: Docs repo tasks (`AdobeDocs/commerce-pwa-studio`)

1. Clone the `AdobeDocs/commerce-pwa-studio` repo:

   ```
   git clone git@github.com:AdobeDocs/commerce-pwa-studio.git
   ```

2. CD into the project and run `yarn` to install the dependencies:

   ```bash
   cd commerce-pwa-studio
   yarn
   ```

3. Add a new `release` branch based off the `main` branch. Example: `release-13.1.0`.

4. Replace the existing `src/data/auto-generated` directory with the `auto-generated` directory you copied from the `magento/pwa-studio` output.

   This replacement should result in one or more changes to existing files. Example:

   ```diff
   7_Docs-Repos/commerce-pwa-studio [release-13.1.0●] » git status
   On branch release-13.1.0
   Changes to be committed:
     (use "git restore --staged <file>..." to unstage)
   +  modified:   src/data/auto-generated/magento-compatibility.md
   +  modified:   src/data/auto-generated/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary.md
   ```

5. Run `yarn dev` to build the docs locally and verify the changed files:

   - http://localhost:8000/integrations/adobe-commerce/version-compatibility/.
   - http://localhost:8000/api/peregrine/talons/CartPage/PriceSummary/

6. Commit and push your release branch to the repo.

7. Create a PR to merge the source-code changes into `main`:

   ```markdown
   ## Purpose of this pull request
   
   This pull request (PR) updates the docs based on the source-code JSDoc changes made for PWA Studio 13.1.0.
   
   ## Affected pages
   
   - src/data/auto-generated/magento-compatibility.md
   - src/data/auto-generated/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary.md
   ```

8. Fix all markdown linting errors. 

   **NOTE:** You WILL have markdown linting errors that you will need to correct. These errors are created by the auto-generated markdown from the `magento/pwa-studio` code base. If you want to fix this at the source, you can adjust the `.hbs` files here: `magento/pwa-devdocs/scripts/create-reference-docs/templates/handlebars`. 

   Otherwise, the linting issues you will encounter are described in the logs. Here are two examples:

   - https://github.com/AdobeDocs/commerce-pwa-studio/actions/runs/4702475698/jobs/8339784257#step:6:119
   - https://github.com/AdobeDocs/commerce-pwa-studio/actions/runs/4702475698/jobs/8339784257#step:6:126

   ![image-20230414135520471](/Users/case/Library/Application Support/typora-user-images/image-20230414135520471.png)

9. After all CI/CD tests (markdown linters, etc.) pass and your reviewers have approved, merge your PR into `main`.

## PART 3: Deploy docs to Production

After the merge tests to `main` have completed successfully, it's time to deploy the documentation changes to the public. Follow these steps.

1. Navigate to the Deployment UI on GitHub: https://github.com/AdobeDocs/commerce-pwa-studio/actions/workflows/deploy.yml

2. Click the **Run Workflow** button and configure the dialog as follows:

   - Use workflow from: `Branch: main`.
   - Deploy to: `prod`.
   - Clean cache: `yes`.

   ![image-20230414141355699](/Users/case/Library/Application Support/typora-user-images/image-20230414141355699.png)

3. After Deployment is successful, check the live site to make sure the changes are displayed. It may take up to 10 minutes for Fastly to update the site after deployment.
