import * as assert from 'assert';
import {mock, when} from '../helper';

import ChangelogLoader from '../../lib/changelog-loader';
import ChangelogParser from '../../lib/changelog-parser';
import {parseVersion} from '../../lib/entities/version';
import FileSystem from '../../lib/file-system';

describe('ChangelogLoader', () => {
  const currentVer = parseVersion('1.0.0');
  const fileSystem = mock(FileSystem);
  when(fileSystem.readFile('EXTENSION_PATH/CHANGELOG.md'))
    .thenResolve('## [1.0.0]\nfoo');
  const changelogParser = new ChangelogParser();
  const changelogLoader = new ChangelogLoader(fileSystem, changelogParser);

  it('loads changelog', async () => {
    const changelog = await changelogLoader.load('EXTENSION_PATH', currentVer);
    assert.ok(changelog.isValid);
  });
});
