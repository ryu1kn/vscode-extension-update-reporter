import * as assert from 'assert';

import ChangelogParser from '../../lib/changelog-parser';
const multiline = require('multiline-string')();

describe('ChangelogParser', () => {
  const changelogParser = new ChangelogParser();
  const CHANGELOG_WITH_RELEASES = multiline(`
    # Change Log

    All notable changes to "My Extension" extension will be documented in this file.

    The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
    and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

    ## [1.0.0] - 2018-04-21
    ### Added
    - foo

    ## [0.0.1] - 2018-04-11
    ### Added
    * Initial release of My Extension
    `);
  const CHANGELOG_NO_RELEASES = multiline(`
    # Change Log

    The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)

    ## Unreleased
    ### Added
    - New "blah" functionality
    `);
  const CHANGELOG_LV2_HEADERS = multiline(`
    ## 1.0.0
    - foo
    `);

  it('gives only the unchecked changelog', async () => {
    const changelog = changelogParser.parse(CHANGELOG_WITH_RELEASES, 'dummy');
    const changes = changelog.getUpdatesSince('0.0.1');
    assert.deepEqual(changes[0].version, '1.0.0');
  });

  it('gives the contents of the change', async () => {
    const changelog = changelogParser.parse(CHANGELOG_WITH_RELEASES, 'dummy');
    const changes = changelog.getUpdatesSince('0.0.1');
    assert.deepEqual(changes[0].changeText, '#### Added\n- foo');
  });

  it('returns nothing if the changelog contains no releases', () => {
    const changelog = changelogParser.parse(CHANGELOG_NO_RELEASES, 'dummy');
    assert.deepEqual(typeof changelog.versions, 'undefined');
  });

  it('parses the changelog of the format that each version have level 2 header', () => {
    const changelog = changelogParser.parse(CHANGELOG_LV2_HEADERS, '1.0.0');
    const changes = changelog.getUpdatesSince('0.0.1');
    assert.deepEqual(changes[0].changeText, '- foo');
  });
});
