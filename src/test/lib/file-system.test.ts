const assert = require('assert');
import {mockObject, when} from '../helper';

import FileSystem from '../../lib/file-system';

describe('FileSystem', () => {
  const fs = mockObject('readdir', 'readFile');
  when(fs.readdir('DIR_PATH')).thenCallback(null, ['FILE1', 'FILE2']);
  when(fs.readFile('FILE_PATH', 'utf8')).thenCallback(null, 'FILE_CONTENTS');
  const fileSystem = new FileSystem(fs);

  it('gets file names in the directory', async () => {
    const files = await fileSystem.readDirectory('DIR_PATH');
    assert.deepEqual(files, ['FILE1', 'FILE2']);
  });

  it('reads a file', async () => {
    const fileContents = await fileSystem.readFile('FILE_PATH');
    assert.deepEqual(fileContents, 'FILE_CONTENTS');
  });
});
