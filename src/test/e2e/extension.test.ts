import * as assert from 'assert';
import {mock, when} from '../helpers/helper';
import {EXT1_CHANGELOG, EXT2_CHANGELOG, EXT3_CHANGELOG, readTestDataFile} from '../helpers/extension-data';

import CommandFactory from '../../lib/command-factory';
import FileSystem from '../../lib/file-system';
import {vscode} from '../helpers/vscode';
import {EXTENSION_NAME} from '../../lib/const';

describe('End to End', () => {

  const fileSystem = mock(FileSystem);
  when(fileSystem.readFile('PATH_1/CHANGELOG.md')).thenResolve(EXT1_CHANGELOG);
  when(fileSystem.readFile('PATH_2/CHANGELOG.md')).thenResolve(EXT2_CHANGELOG);
  when(fileSystem.readFile('PATH_3/CHANGELOG.md')).thenResolve(EXT3_CHANGELOG);

  const commandFactory = new CommandFactory(fileSystem, vscode);
  const main = commandFactory.createMain();

  vscode.workspace.registerTextDocumentContentProvider(EXTENSION_NAME, commandFactory.createContentProvider());

  it('generates a summary', async () => {
    await main.run();
    assert.deepEqual(vscode._providedContent, readTestDataFile('./sample-report.html'));
  });
});
