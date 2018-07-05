[![Build Status](https://travis-ci.org/ryu1kn/vscode-extension-update-reporter.svg?branch=master)](https://travis-ci.org/ryu1kn/vscode-extension-update-reporter)

# Extension Update Reporter

Present you the summary of all the changes of the installed extensions by checking their changelogs.
With this extension, you don't need to go and check the changelog of each individual extension.

![Report updates on startup](https://raw.githubusercontent.com/ryu1kn/vscode-extension-update-reporter/master/images/public.gif)

### How it works

On the editor startup, it finds all the updated extensions by comparing the current versions of the
installed extensions and their last recorded versions. Once it finds the updated extensions,
it then checks their changelogs, collecting their updates made after their last recorded versions.
Finally, it shows the gathered information as a report.

## Configurations

* `extensionUpdateReporter.lastCheckedVersions`: Last checked version of all extensions.

    This extension uses this setting to detect extension updates and the value is automatically maintained.

## Request Features or Report Bugs

* https://github.com/ryu1kn/vscode-extension-update-reporter/issues

## Changelog

* https://github.com/ryu1kn/vscode-extension-update-reporter/blob/master/CHANGELOG.md
