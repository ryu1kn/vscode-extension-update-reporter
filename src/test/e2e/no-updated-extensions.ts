import * as assert from 'assert';
import {mock} from '../helpers/helper';

import FileSystem from '../../lib/file-system';
import {createVsCode} from '../helpers/vscode';
import ExtensionStarter from '../../lib/extension-starter';
import {createExtensionContext} from '../helpers/extension-data';

describe('No updated extensions', () => {

  const fileSystem = mock(FileSystem);

  const lastRecordedVersions = {
    ID_1: '1.0.0',
    ID_2: '1.0.0'
  };
  const vscode = createVsCode(lastRecordedVersions);

  const extensionStarter = new ExtensionStarter(vscode, fileSystem);

  it('records newly installed extension versions', async () => {
    await extensionStarter.start(createExtensionContext());
    assert.deepStrictEqual(vscode._configUpdateCall, [
      'lastCheckedVersions',
      { ID_1: '1.0.0', ID_2: '1.0.0', ID_3: '0.12.1' },
      true
    ]);
  });
});
