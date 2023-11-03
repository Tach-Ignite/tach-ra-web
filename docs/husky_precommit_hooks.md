## Husky Pre-Commit Hooks

Husky is a package that allows you to easily add Git hooks to your project. Git hooks are scripts that are run automatically by Git at certain points in the Git workflow, such as before a commit is made or after a branch is checked out. Husky provides a simple way to define and manage Git hooks in your project.

### package.json

In the `package.json` file, Husky is used to define several scripts that are run automatically by Git hooks. The `prepare` script installs the Husky Git hooks, while the `pre-commit` script formats and lints the code before it is committed. The `pretty` and `lint` scripts are used by the `pre-commit` script to format and lint the code, respectively.

### .husky folder

The `.husky` folder contains the hook scripts that are run by Git. The `pre-commit` script is responsible for formatting and linting the code before it is committed. This script uses the `pnpm` command to run the `pretty` and `lint` scripts defined in the `package.json` file. The `pretty` script uses the `prettier` package to format the code, while the `lint` script uses the `eslint` package to lint the code.

### pre-commit hook

The `pre-commit` hook is a Git hook that is run automatically before a commit is made. The `pre-commit` script in the `.husky` folder is responsible for formatting and linting the code before it is committed. This helps to ensure that the code is consistent and follows best practices. The `pnpm` command is used to run the `pretty` and `lint` scripts defined in the `package.json` file, which use the `prettier` and `eslint` packages, respectively.

Overall, Husky is a powerful tool for managing Git hooks in your project. It allows you to define and manage hooks in a simple and intuitive way, and it provides a way to ensure that your code is properly formatted and linted before it is committed.
