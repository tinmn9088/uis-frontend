# University Information System

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Deployment

1. Start with the production build: `ng build`

1. Copy everything within the output folder (`dist/project-name/`) to a folder on the server.

1. Configure the server to redirect requests for missing files to _index.html_.

See [Angular - Deployment](https://angular.io/guide/deployment#basic-deployment-to-a-remote-server).

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Configuration

See [environments](src/environments).

See [modules.json](src/assets/modules.json).

See [i18n](src/assets/i18n).

## Development

### Launch

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Prettier and ESLint

#### VSCode

Install:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) Extension
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) Extension
