import * as assert from 'assert';

import Extension from '../../lib/entities/extension';

describe('Extension', () => {
  it('uses displayName as its name', async () => {
    const extension = createExtension({ displayName: 'foo', name: 'bar' });
    assert.deepEqual(extension.displayName, 'foo');
  });

  it('uses name as its name if displayName is not available', async () => {
    const extension = createExtension({ name: 'bar' });
    assert.deepEqual(extension.displayName, 'bar');
  });

  function createExtension (packageJson: any) {
    const rawExtension = {
      packageJSON: packageJson
    };
    return new Extension(rawExtension);
  }
});
