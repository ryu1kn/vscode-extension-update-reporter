
# How to Contribute

## Setting up dev environment

### Prerequisites

* Node.js version specified in [.nvmrc](./.nvmrc)
* Yarn for package manager: https://yarnpkg.com/

### Setup

```sh
yarn install
```

## Development

### Debug

1. Open the project in VSCode.
2. Press <kbd>F5</kbd> ("Start Debugging"). Make sure launch configuration "Run Extension" is active.
3. This will open another VSCode instance.

### Tests

I'd love to see that tests are written to confirm the new behaviors.
Existing tests should be updated when needed.

## Trying out your changes

You can try out your changes with your VS Code. More details [here](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix).

1. Create a package with your changes

   ```sh
   vsce package
   ```

   This produces `extension-update-reporter-<version>.vsix`.

1. Install the package into your VS Code

   ```sh
   code --install-extension extension-update-reporter-<version>.vsix
   ```

1. Restart your VS Code

## CI

You can check what CI is checking at [.github/workflows](./.github/workflows/).
