import * as assert from 'assert';
import {mock, when} from '../helpers/helper';
import {EXT1_CHANGELOG, EXT2_CHANGELOG, EXT3_CHANGELOG, readTestDataFile, vscode} from '../helpers/extension-data';

import CommandFactory from '../../lib/command-factory';
import FileSystem from '../../lib/file-system';

describe('End to End', () => {

  const fileSystem = mock(FileSystem);
  when(fileSystem.readFile('PATH_1/CHANGELOG.md'))
    .thenResolve(EXT1_CHANGELOG);
  when(fileSystem.readFile('PATH_2/CHANGELOG.md'))
    .thenResolve(EXT2_CHANGELOG);
  when(fileSystem.readFile('PATH_3/CHANGELOG.md'))
    .thenResolve(EXT3_CHANGELOG);
  const commandFactory = new CommandFactory(fileSystem, vscode);
  const main = commandFactory.createMain();
  const contentProvider = commandFactory.createContentProvider();

  it('generates a summary', async () => {
    await main.run();
    const html = await contentProvider.provideTextDocumentContent();
    assert.deepEqual(html, readTestDataFile('./sample-report.html'));
  });
});
