# Local Development Setup

## Linux Development

This RA is designed to be run in a Linux environment. Although it has only been tested in Ubuntu, it should also work in other distributions.

## WSL Support for Windows Development

If you're on Windows, you can utilize this RA using WSL2. For instructions on how to install WSL, see [this guide](https://learn.microsoft.com/en-us/windows/wsl/install). WSL also has built-in compatibility with [Visual Studio Code (VS Code)](https://code.visualstudio.com/). See [this guide](https://code.visualstudio.com/docs/remote/wsl) for more information about configuring VS Code to work with WSL.

We recommend avoiding using windows mounts (such as /mnt/c). If you must, ensure you follow best practices, such as using metadata so chmod works.

## Local Initialization

This repository comes with a `localInit.sh` script to help set up some of the dependencies. To run the script, run the following commands:

```bash
chmod +x localInit.sh  # Make localInit.sh executable
./localInit.sh
```

This script does the following:

- Checks for Node installation.
- Installs OpenSSL and Pnpm.
- Runs pnpm install to install local dependencies.
- Creates the `server.ts` file for local https. Note that this file is ignored by git and will not be committed to the repository. This file is only for local https development.
- Creates a `.env` and `.env.secrets` files with the required environment variables. **Be sure to fill these out with the correct values**.
- Creates a self-signed SSL certificate for local development.
- Sets `NODE_ENV` to `development`.

## Environment Dependencies

### Node

Node is used to run the application. The preferred way to manage Node installation is to use nvm. To install nvm, follow [this guide](https://github.com/nvm-sh/nvm). If you'd prefer to manage installing Node yourself, you can download [here](https://nodejs.org/en/download) or via a [package manager](https://nodejs.org/en/download/package-manager).

**Note:** There are some potential IPv6 issues in Node versions 18.xx and above that may need to be resolved. If you run into issues, try installing Node version 16.xx.

### Docker (Optional)

Docker can be used to run the local database. We have a script to spin up a mongodb instance if you would like to run it in a Docker container. For more information, see the [containerized](/docs/containerized.md) documentation.

For more information on how install docker, see [this guide](https://docs.docker.com/get-docker/). If you are on windows, make sure to select the option to run [docker on WSL2](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-containers).

### OpenSSL

OpenSSL is installed via the `localInit` script. We use OpenSSL to create a self-signed SSL certificate for local development. To learn more about OpenSSL, see [here](https://www.openssl.org/).

The localInit script also creates the self-signed certificates for local https. Local HTTPS is necessary for NextAuth credentials provider to work with the database strategy; We must be able to set secure cookies, and this can only be done over HTTPS.

### Pnpm

Pnpm is installed via the `localInit` script. Pnpm is a node package manager, used in leui of npm to manage local node dependencies and to run the application. To learn more about Pnpm, see [here](https://pnpm.io/).

# Basics to start development

The following sections will walk you through the basics of starting development with this RA, including spinning up the local database, building the application, and debugging.

## Environment Variables

You will need to configure a `.env.local` file with the variables from `.env.local.example` filled out with relevant values. While this example file covers a large number of external services, you only need to fill out the ones that you are using with real values. For example, if you aren't using paypal as a payment provider, feel free to leave those as default.

Read [here](/docs/environment_variables.md) to learn more about these environment variables.

## Local Database

This project uses mongodb as the database. You can have a local instance of mongodb running on your machine, or you can use the docker-compose file in the infra folder to spin up a mongodb instance in a container.

If you would like to install the database manually, see [this guide](https://www.mongodb.com/docs/manual/administration/install-on-linux/).

### Local Database in Container (Optional)

To run the local database in a Docker container, ensure docker is running locally, then run the following commands to change the directory to the `infra` folder and start the database container:

```bash
cd infra
docker-compose up -d
```

This will spin up a mongodb instance on port `27017`. The database will be named `tach-next-ts`.

### Seeding the database

The demo project contains all the seeding data necessary for a functioning storefront, including one Admin user and one regular user. To run the seeder, run the follow command:

```bash
pnpm data:seed
```

For more information on customizing the seeder, see the [Data Seeder](/docs/seeder.md) section.

## Building the application

To build the application, run the following command:

```bash
pnpm build
```

In order for Static Site Generation (SSG) to succeed, the database needs to be running and reachable.

## Running the application in development mode

To start the application in dev mode, run the following command:

```bash
pnpm dev
```

## Navigating the website

In your browser, navigate to `https://localhost:3000`. You may get some security alerts because local development uses a self-signed certificate. Proceed anyway. The application will start on the demo landing page. These landing pages include information about the seeded users for the demo.

## Debugging the application in VS Code

This repo comes with a VS Code configuration for debugging. You can start the debugger by pressing F5 or selecting Run > Start Debugging.

## Linting the application

To lint the application, run the following command:

```bash
pnpm lint
```
