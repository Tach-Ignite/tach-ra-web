# Open Issues

## ESLint

We currently have 2 rules disabled in the .eslintrs.json config file:

```json
"overrides": [
    {
      "files": ["**/*"],
      "rules": {
        "import/no-extraneous-dependencies": "off",
        "class-methods-use-this": "off"
      }
    }
  ]
```

- The `import/no-extraneous-dependencies` rule will throw an error that the `@aws-sdk/client-ses` package should be listed as a dependency, not a devDependency despite already being listed as a dependency.
- The `class-methods-use-this`: while methods that don't use `this` should probably be either functions or static methods, such revisions do not align with our SOLID approach.

## app router to pages router conversion

edit errors:

1. edit a product
2. check console for errors
   a. One error is related to accessing cookies in nextAuth when checking that the user has rights to the seller dashboard
   b. Another seems to be related to revalidation of the data: static generation store missing in revalidateTag

create errors:

1. create a product
2. hit submit
3. nothing happens. The request seems to hang indefinitely. The product is not created.

## AWS S3 presigned urls and Stripe

Stripe has a 500 character image url limit and AWS S3 presigned urls are very long. Therefore, you cannot use presigned urls to host product images and display them in stripe. As a workaround, you can make product images publicly available and the urls will be within the character limit.

## Tree-shaking

See (this GitHub issue)[https://github.com/vercel/next.js/issues/12557]. Tree shaking doesn't work. None of the suggestions in this issue work because we are currently utilizing a monorepo. This means a few things:

1. First load js bundle sizes are larger than they should be.
2. Separating client vs server capabilities becomes extremely important; any server-only code that exists in the tree of a barrel file utilized by the client will throw an exception on the client.
3. The IOC Containers almost gaurantee maximum bundle size. The IOC container has references to the entire dependency tree; therefore, anything that uses these will have the entire dependency tree too.

## Paypal Shipping Information

Although we are properly passing shipping information to paypal when creating the order, their API ignores it.
