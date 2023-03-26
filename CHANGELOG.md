# Change Log

All notable changes to "Extension Update Reporter" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).


## [1.3.0] - 2023-03-26
### Added
- Add command to show report. Closes [#8](https://github.com/ryu1kn/vscode-extension-update-reporter/issues/8) by @jerone in [PR #38](https://github.com/ryu1kn/vscode-extension-update-reporter/pull/38).
- Add before and after versions. Closes [#4](https://github.com/ryu1kn/vscode-extension-update-reporter/issues/4) by @jerone in [PR #40](https://github.com/ryu1kn/vscode-extension-update-reporter/pull/40).

### Fixed
- Improve homepage and add repository links. Fixes [#41](https://github.com/ryu1kn/vscode-extension-update-reporter/issues/41) by @jerone in [PR #42](https://github.com/ryu1kn/vscode-extension-update-reporter/pull/42).
- Improve extension performance. Fixes [#39](https://github.com/ryu1kn/vscode-extension-update-reporter/issues/39) by @jerone in [PR #48](https://github.com/ryu1kn/vscode-extension-update-reporter/pull/48).
- Fix rendering markdown tables. Fixes [#46](https://github.com/ryu1kn/vscode-extension-update-reporter/issues/46) by @jerone in PR [#49](https://github.com/ryu1kn/vscode-extension-update-reporter/pull/49).

## [1.2.0] - 2022-11-06
### Added
- Marketplace, extension homepage links are always available for easier access to the full information. (thanks to @jerone [PR #29](https://github.com/ryu1kn/vscode-extension-update-reporter/issues/29))
- Display a table-of-contents at the top of the updates report when there are multiple extensions updated, allowing you to jump to the extension update of your interests. (thanks to @jerone [PR #36](https://github.com/ryu1kn/vscode-extension-update-reporter/issues/36))

## [1.1.0] - 2022-09-24
### Added
- Extension changelogs are now collapsible. Giving easier access to the next extension changelog, without having to scroll for long time. (thanks to @jerone [PR #31](https://github.com/ryu1kn/vscode-extension-update-reporter/issues/31))

### Fixed
- Fixed the issue where it failed to find a version heading prefix when the version string appears more than once in a heading. (thanks to @jerone [PR #28](https://github.com/ryu1kn/vscode-extension-update-reporter/issues/28))

## [1.0.3] - 2019-03-24
### Fixed
- Replaced the use of deprecated `previewHtml` command with the WebViewPanel. [#7](https://github.com/ryu1kn/vscode-extension-update-reporter/issues/7)

## [1.0.2] - 2018-07-05
### Fixed
- Fixed typo [#5](https://github.com/ryu1kn/vscode-extension-update-reporter/issues/5)

## [1.0.1] - 2018-06-26
### Fixed
- Fixed the issue that the installation was getting stuck on Windows again. [#1](https://github.com/ryu1kn/vscode-extension-update-reporter/issues/1)

## [1.0.0] - 2018-06-25
### Added
- Display a link to the changelog on marketplace if parsing changelog failed. [#2](https://github.com/ryu1kn/vscode-extension-update-reporter/issues/2)

## [0.2.0] - 2018-05-13
### Added
- Display extension IDs on the report.

## [0.1.2] - 2018-05-10
### Fixed
- Fixed the issue that the installation was getting stuck on Windows. [#1](https://github.com/ryu1kn/vscode-extension-update-reporter/issues/1)

## [0.1.1] - 2018-05-09
### Fixed
- Fixed the issue that characters are barely readable on dark themes.

## [0.1.0] - 2018-05-05
### Added
- Initial release
