import * as assert from 'assert';
import {mockObject, when} from '../helpers/helper';

import FileSystem from '../../lib/file-system';

describe('FileSystem', () => {
  const fs = mockObject('readFile');
  when(fs.readFile('FILE_PATH', 'utf8')).thenCallback(null, 'FILE_CONTENTS');
  when(fs.readFile('WRONG_FILE_PATH', 'utf8')).thenCallback(new Error('ERROR'));
  const fileSystem = new FileSystem(fs);

  it('reads a file', async () => {
    const fileContents = await fileSystem.readFile('FILE_PATH');
    assert.strictEqual(fileContents, 'FILE_CONTENTS');
  });

  it('fails to read non-existing file', () =>
    fileSystem.readFile('WRONG_FILE_PATH')
      .then(
        () => { throw new Error('Should have rejected'); },
        e => { assert.equal(e.message, 'ERROR'); }
      )
  );
});
