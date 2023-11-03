# Amplify

Amplify is a quickstart platform great for building serverless applications quickly. It also provides first class support for NextJS. However, there are a number of challenges that can arise when building. We've designed the included `amplify.yml` to work out of the box with our recommended tech stack.

## amplify.yaml

This file will be picked up automatically by amplify if it finds it in your repo and is used to build and release the application. This file should work in all environments; however, remember to set the `NODE_ENV` environment variable to `production` in production and `development` everywhere else.

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - export NODE_ENV_ORIG=$(env | grep -e NODE_ENV | cut -d '=' -f2)
        - export NODE_ENV=development
        - npx pnpm install --frozen-lockfile --force --ignore-scripts
    build:
      commands:
        - export NODE_ENV=$NODE_ENV_ORIG
        - env | grep -e NODE_ENV -e EXPOSE_ERROR_STACK >> .env.local
        - env | grep -e NEXTAUTH_ -e NEXT_PUBLIC_ >> .env.local
        - env | grep -e TACH_* >> .env.local
        - cat .env.local > .env.production
        - npx pnpm build
    postBuild:
      commands:
        - npx pnpm prune --production --config.ignore-scripts=true
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Explanation

### PreBuild

First we store the `NODE_ENV` value in a variable so we can restore it later. We then set the `NODE_ENV` to development; we must do this because of a limitation with NextJS typescript projects that will cause the build to fail unless `devDependencies` are installed. We then install the dependencies using `pnpm` with specific settings to avoid errors with package caching in Amplify, as well as husky errors.

### Build

In the Build step, we restore the `NODE_ENV` variable, copy the environment variables configured in Amplify into an .env.production file, then build the application. We avoid having to specify specific environment variables by using common prefixes. Some of these prefixes are conventions from NextJS and NextAuth and should not change. For others included in the RA, we use the `TACH_` prefix.

### PostBuild

In the post build step, we prune the dependencies to only production dependencies, and ignore scripts to avoid husky errors.

### Known Issues

Amplify will only work if your build bundle is less than 200MB. Because Next standalone builds include `node_modules`, the bundles can be quite large. In the long term, its best the use SST to deploy and manage your infrastructure.
