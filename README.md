[![CI Build](https://github.com/ryu1kn/vscode-extension-update-reporter/actions/workflows/ci-build.yml/badge.svg?branch=master)](https://github.com/ryu1kn/vscode-extension-update-reporter/actions/workflows/ci-build.yml)

# Extension Update Reporter

Present you the summary of all the changes of the installed extensions by checking their changelogs.
With this extension, you don't need to go and check the changelog of each individual extension.

![Report updates on startup](https://raw.githubusercontent.com/ryu1kn/vscode-extension-update-reporter/master/images/public.gif)

### How it works

On the editor startup, it finds all the updated extensions by comparing the current versions of the
installed extensions and their last recorded versions. Once it finds the updated extensions,
it then checks their changelogs, collecting their updates made after their last recorded versions.
Finally, it shows the gathered information as a report.

## Request Features or Report Bugs

Feature requests and bug reports are very welcome: https://github.com/ryu1kn/vscode-extension-update-reporter/issues

A couple of requests from me when you raise an github issue.

* **Requesting a feature:** Please try to provide the context of why you want the feature. Such as, in what situation the feature could help you and how, or how the lack of the feature is causing an inconvenience to you. I can't think of introducing it until I understand how it helps you 🙂
* **Reporting a bug:** Please include environment information (OS name/version, the editor version). Also consider providing screenshots (or even videos) where appropriate. They are often very very helpful!

## Configurations

* `extensionUpdateReporter.lastCheckedVersions`: Last checked version of all extensions.

    This extension uses this setting to detect extension updates and the value is automatically maintained.

## Changelog

* https://github.com/ryu1kn/vscode-extension-update-reporter/blob/master/CHANGELOG.md

## How to contribute

Thank you for considering a contribution. Please check [CONTRIBUTING.md](./CONTRIBUTING.md).
