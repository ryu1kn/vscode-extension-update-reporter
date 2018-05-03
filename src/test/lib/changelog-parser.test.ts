import * as assert from 'assert';

import ChangelogParser from '../../lib/changelog-parser';
import {parseVersion} from '../../lib/entities/version';

const multiline = require('multiline-string')();

describe('ChangelogParser', () => {
  const dummyVer = parseVersion('0.0.0');
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
  const CHANGELOG_LV2_HEADERS = multiline(`
    ## 1.0.0
    - foo
    `);
  const CHANGELOG_WRONG_SUBSECTION_LEVEL = multiline(`
    ### 1.0.0

    ### Fixes:
    - foo
    `);

  it('gives only the unchecked changelog', async () => {
    const changelog = changelogParser.parse(CHANGELOG_WITH_RELEASES, dummyVer);
    const changes = changelog!.getUpdatesSince(parseVersion('0.0.1'));
    assert.deepEqual(changes[0].version.toString(), '1.0.0');
  });

  it('gives the contents of the change', async () => {
    const changelog = changelogParser.parse(CHANGELOG_WITH_RELEASES, dummyVer);
    const changes = changelog.getUpdatesSince(parseVersion('0.0.1'));
    assert.deepEqual(changes[0].changeText, '#### Added\n- foo');
  });

  it('parses the changelog of the format that each version have level 2 header', () => {
    const changelog = changelogParser.parse(CHANGELOG_LV2_HEADERS, parseVersion('1.0.0'));
    const changes = changelog.getUpdatesSince(parseVersion('0.0.1'));
    assert.deepEqual(changes[0].changeText, '- foo');
  });

  it('treats as if it were just a normal text if version is malformed', () => {
    const changelog = changelogParser.parse(CHANGELOG_WRONG_SUBSECTION_LEVEL, parseVersion('1.0.0'));
    const changes = changelog.getUpdatesSince(parseVersion('0.0.1'));
    assert.deepEqual(changes[0].version.toString(), '1.0.0');
    assert.deepEqual(changes[0].changeText, '### Fixes:\n- foo');
  });
});
