import {join} from 'path';
import * as assert from 'assert';
import {mock, when} from '../helpers/helper';
import {createExtensionContext, EXT1_CHANGELOG, EXT2_CHANGELOG, EXT3_CHANGELOG, readTestDataFile} from '../helpers/extension-data';

import FileSystem from '../../lib/file-system';
import {createVsCode} from '../helpers/vscode';
import ExtensionStarter from '../../lib/extension-starter';

describe('Presents the report', () => {

  const fileSystem = mock(FileSystem);
  when(fileSystem.readFile(join('PATH_1', 'CHANGELOG.md'))).thenResolve(EXT1_CHANGELOG);
  when(fileSystem.readFile(join('PATH_2', 'CHANGELOG.md'))).thenResolve(EXT2_CHANGELOG);
  when(fileSystem.readFile(join('PATH_3', 'CHANGELOG.md'))).thenResolve(EXT3_CHANGELOG);

  const vscode = createVsCode();

  const extensionStarter = new ExtensionStarter(vscode, fileSystem);

  it('generates a summary', async () => {
    await extensionStarter.start(createExtensionContext());
    assert.strictEqual(vscode._providedContent, readTestDataFile('./sample-report.html'));
  });
});
