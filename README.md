# Tach Reference Architecture (RA) - Nextjs

This is a Reference Architecture (RA) based on [React](https://reactjs.org/) + [Next.js](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/) + [Tailwind CSS](https://tailwindcss.com/). You are encouraged to study these technologies before continuing as they are relied on heavily throughout the RA.

## Table of Contents

- [Quickstart](/docs/quickstart.md)
- [Local Development Setup](/docs/local_development_setup.md)
- [RA Features](/docs/ra_features.md)
- [Configuring External Dependencies](/docs/configuring_external_dependencies.md)
- [Environment Variables](/docs/environment_variables.md)
- [Package Dependencies](/docs/package_dependencies.md)
- [Directory Structure](/docs/directory_structure.md)
- [RTK Query](/docs/rtk_query.md)
- [Containerization](/docs/containerized.md)
- [Husky Pre-Commit Hooks](/docs/husky_precommit_hooks.md)
- [Amplify](/docs/amplify.md)
- [Open Issues](/docs/open_issues.md)

## Sample Application

The sample application is a simple e-commerce website, including admin management features. It allows users with the `Admin` role to manage inventory including adding, editing, and deleting products, categories, users, and orders through the admin dashboard (`/admin`). These products can then be viewed through user-facing pages (`/p`).
