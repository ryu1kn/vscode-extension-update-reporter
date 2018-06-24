import * as assert from 'assert';
import * as td from 'testdouble';
import ChangelogLoader from '../../lib/changelog-loader';
import ChangelogParser from '../../lib/changelog-parser';
import {parseVersion} from '../../lib/entities/version';
import FileSystem from '../../lib/file-system';

describe('ChangelogLoader', () => {
  const currentVer = parseVersion('1.0.0');
  const fileSystem = td.object(['readDirectory', 'readFile']) as FileSystem;
  td
    .when(fileSystem.readDirectory('EXTENSION_PATH'))
    .thenResolve(['CHANGELOG.md', 'package.json']);
  td
    .when(fileSystem.readFile('EXTENSION_PATH/CHANGELOG.md'))
    .thenResolve('## [1.0.0]\nfoo');
  const changelogParser = new ChangelogParser();
  const changelogLoader = new ChangelogLoader(fileSystem, changelogParser);

  it('loads changelog', async () => {
    const changelog = await changelogLoader.load('EXTENSION_PATH', currentVer);
    changelog.map(changelog => assert.ok(changelog.isValid));
  });
});
