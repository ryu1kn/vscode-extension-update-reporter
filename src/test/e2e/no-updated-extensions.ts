import * as assert from 'assert';
import {mock} from '../helpers/helper';

import CommandFactory from '../../lib/command-factory';
import FileSystem from '../../lib/file-system';
import {createVsCode} from '../helpers/vscode';
import {EXTENSION_NAME} from '../../lib/const';

describe('No updated extensions', () => {

  const fileSystem = mock(FileSystem);

  const lastRecordedVersions = {
    ID_1: '1.0.0',
    ID_2: '1.0.0'
  };
  const vscode = createVsCode(lastRecordedVersions);

  const commandFactory = new CommandFactory(fileSystem, vscode);
  const main = commandFactory.createMain();

  vscode.workspace.registerTextDocumentContentProvider(EXTENSION_NAME, commandFactory.createContentProvider());

  it('records newly installed extension versions', async () => {
    await main.run();
    assert.deepEqual(vscode._configUpdateCall, [
      'lastCheckedVersions',
      { ID_1: '1.0.0', ID_2: '1.0.0', ID_3: '0.12.1' },
      true
    ]);
  });
});
