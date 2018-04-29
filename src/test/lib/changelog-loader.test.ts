import * as assert from 'assert';
const td = require('testdouble');

import ChangelogLoader from '../../lib/changelog-loader';
import ChangelogParser from "../../lib/changelog-parser";

describe('ChangelogLoader', () => {
  const fileSystem = td.object(['readDirectory', 'readFile']);
  td
    .when(fileSystem.readDirectory('EXTENSION_PATH'))
    .thenResolve(['CHANGELOG.md', 'package.json']);
  td
    .when(fileSystem.readFile('EXTENSION_PATH/CHANGELOG.md'))
    .thenResolve('CHANGELOG_CONTENTS');
  const changelogParser = td.object('parse') as ChangelogParser;
  td.when(changelogParser.parse('CHANGELOG_CONTENTS', 'dummy')).thenReturn('PARSED_CHANGELOG_CONTENTS');
  const changelogLoader = new ChangelogLoader(fileSystem, changelogParser as ChangelogParser);

  it('loads changelog', async () => {
    const changelog = await changelogLoader.load('EXTENSION_PATH', 'dummy');
    assert.deepEqual(changelog, 'PARSED_CHANGELOG_CONTENTS');
  });
});
