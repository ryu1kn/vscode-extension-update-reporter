import * as td from 'testdouble';

import ConfigStore from '../../lib/config-store';
import * as vscode from 'vscode';
import {Version} from '../../lib/entities/version';

describe('ConfigStore', () => {
  const any = td.matchers.anything;
  let configSection: vscode.WorkspaceConfiguration;
  let configStore: ConfigStore;

  beforeEach(() => {
    const workspace: any = td.object('getConfiguration');
    configSection = td.object(['get', 'update']) as vscode.WorkspaceConfiguration;
    td
      .when(configSection.get('extensionVersions'))
      .thenReturn({ EXT_1: '0.1.0' });
    td
      .when(workspace.getConfiguration('changelogChecker'))
      .thenReturn(configSection);
    configStore = new ConfigStore(workspace);
  });

  it('saves the current version of an extension if not saved yet', async () => {
    await configStore.registerAllExtensions({
      EXT_1: new Version(0, 1, 0),
      EXT_2: new Version(0, 2, 0)
    });

    td.verify(
      configSection.update(
        'extensionVersions',
        { EXT_1: '0.1.0', EXT_2: '0.2.0' },
        true
      )
    );
  });

  it("doesn't update the extension version", async () => {
    await configStore.registerAllExtensions({
      EXT_1: new Version(0, 2, 0)
    });

    td.verify(configSection.update(any(), any(), any()), { times: 0 });
  });
});
