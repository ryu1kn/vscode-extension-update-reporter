import * as assert from 'assert';

import ChangelogParser from '../../lib/changelog-parser';
import {parseVersion} from '../../lib/entities/version';

const multiline = require('multiline-string')();

describe('ChangelogParser', () => {
  const previousVer = parseVersion('1.2.0');
  const currentVer = parseVersion('1.3.0');
  const changelogParser = new ChangelogParser();
  const CHANGELOG_WITH_RELEASES = multiline(`
    # Change Log

    All notable changes to "My Extension" extension will be documented in this file.

    The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
    and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

    ## [1.3.0] - 2018-04-21
    ### Added
    - foo

    ## [1.2.0] - 2018-04-11
    ### Added
    * Initial release of My Extension
    `);

  it('gives only the unchecked changelog', () => {
    const changelog = changelogParser.parse(CHANGELOG_WITH_RELEASES, currentVer);
    const changes = changelog.getUpdatesSince(previousVer);
    assert.strictEqual(changes[0].version.toString(), '1.3.0');
  });

  it('gives the contents of the change', () => {
    const changelog = changelogParser.parse(CHANGELOG_WITH_RELEASES, currentVer);
    const changes = changelog.getUpdatesSince(previousVer);
    assert.strictEqual(changes[0].changeText, '### Added\n- foo');
  });

  it('parses the changelog of the format that each version have level 2 header', () => {
    const changelogText = multiline(`
        ## 1.3.0
        - foo
        `);
    const changelog = changelogParser.parse(changelogText, currentVer);
    const changes = changelog.getUpdatesSince(previousVer);
    assert.strictEqual(changes[0].changeText, '- foo');
  });

  it('treats as if it were just a normal text if version is malformed', () => {
    const changelogText = multiline(`
        ### 1.3.0

        ### Fixes:
        - foo
        `);
    const changelog = changelogParser.parse(changelogText, currentVer);
    const changes = changelog.getUpdatesSince(previousVer);
    assert.strictEqual(changes[0].version.toString(), '1.3.0');
    assert.strictEqual(changes[0].changeText, '### Fixes:\n- foo');
  });

  it('parses the changelog with version section not starting with version number', () => {
    const changelogText = multiline(`
        ## Release 1.3.0

        * foo
        * bar

        ## Release 1.2.0

        * baz
        `);
    const changelog = changelogParser.parse(changelogText, currentVer);
    const changes = changelog.getUpdatesSince(previousVer);
    assert.strictEqual(changes[0].version.toString(), '1.3.0');
    assert.strictEqual(changes[0].changeText, '* foo\n* bar');
  });

  it('parses Keep-a-changelog like changelog without reference to it', () => {
    const changelogText = multiline(`
        ## [1.3.0]

        * foo
        * bar

        ## [1.2.0]

        * baz
        `);
    const changelog = changelogParser.parse(changelogText, currentVer);
    const changes = changelog.getUpdatesSince(previousVer);
    assert.strictEqual(changes[0].version.toString(), '1.3.0');
    assert.strictEqual(changes[0].changeText, '* foo\n* bar');
  });

  it.skip('parses a changelog whose header uses equal signs', () => {
    const changelogText = multiline(`
        1.3.0
        =====

        * foo
        * bar

        1.2.0
        =====

        * baz
        `);
    const changelog = changelogParser.parse(changelogText, currentVer);
    const changes = changelog.getUpdatesSince(previousVer);
    assert.strictEqual(changes[0].version.toString(), '1.3.0');
    assert.strictEqual(changes[0].changeText, '* foo\n* bar');
  });

  it('parses a changelog who claims it follows keep-a-changelog but actually not', () => {
    const changelogText = multiline(`
        The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)

        ## 1.3.0 - 2018-03-29

        ### Added
        * foo
        * bar

        ## 1.2.0 - 2018-03-28

        ### Added
        * baz
        `);
    const changelog = changelogParser.parse(changelogText, currentVer);
    const changes = changelog.getUpdatesSince(previousVer);
    assert.strictEqual(changes[0].version.toString(), '1.3.0');
    assert.strictEqual(changes[0].changeText, '### Added\n* foo\n* bar');
  });

  it("doesn't parse a changelog whose version is missing patch number", () => {
    const changelogText = multiline(`
        ## 1.3

        * foo
        * bar

        ## 1.2

        * baz
        `);
    const changelog = changelogParser.parse(changelogText, currentVer);
    assert.equal(changelog.isValid, false);
  });

  it('correctly parses even when a version string appears more than once', () => {
    const changelogText = multiline(`
        ## 1.3.0 - Upgrading Node.js to 11.3.0

        * foo
        * bar

        ## 1.2.0

        * baz
        `);
    const changelog = changelogParser.parse(changelogText, currentVer);
    const changes = changelog.getUpdatesSince(previousVer);
    assert.strictEqual(changes[0].version.toString(), '1.3.0');
    assert.strictEqual(changes[0].changeText, '* foo\n* bar');
  });

  it('parses a changelog that follows Conventional Commits convention', () => {
    const changelogText = multiline(`
        # Change Log

        All notable changes to this project will be documented in this file.
        See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

        ## [1.3.0](https://github.com/user/repo/compare/v1.2.0...v1.3.0) (2022-09-07)

        ### Bug Fixes

        * foo
        * bar

        ## [1.2.0](https://github.com/user/repo/compare/v1.1.0...v1.2.0) (2022-09-06)

        ### Bug Fixes

        * baz
        `);
    const changelog = changelogParser.parse(changelogText, currentVer);
    const changes = changelog.getUpdatesSince(previousVer);
    assert.strictEqual(changes[0].version.toString(), '1.3.0');
    assert.strictEqual(changes[0].changeText, '### Bug Fixes\n\n* foo\n* bar');
  });
});
