import * as assert from 'assert';

import {RawExtension} from '../../lib/entities/extension';
import * as vscode from 'vscode';

describe('Extension', () => {
  it('uses displayName as its name', async () => {
    const extension = createExtension({ displayName: 'foo', name: 'bar' });
    assert.strictEqual(extension.displayName, 'foo');
  });

  it('uses name as its name if displayName is not available', async () => {
    const extension = createExtension({ name: 'bar' });
    assert.strictEqual(extension.displayName, 'bar');
  });

  function createExtension (packageJson: {name: string, displayName?: string}) {
    const rawExtension = {
      packageJSON: packageJson
    };
    return new RawExtension(rawExtension as vscode.Extension<any>);
  }
});
