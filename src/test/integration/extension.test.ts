import * as assert from 'assert';
import * as td from 'testdouble';

import CommandFactory from '../../lib/command-factory';
import FileSystem from '../../lib/file-system';
import { readFileSync as fsReadFileSync } from 'fs';
import { join } from 'path';

describe.skip('Integration', () => {
  const vscode = {
    extensions: {
      all: [
        {
          id: 'ID_1',
          extensionPath: 'PATH_1',
          packageJSON: { displayName: 'My Extension 1', version: '1.0.0' }
        },
        {
          id: 'ID_2',
          extensionPath: 'PATH_2',
          packageJSON: { displayName: 'My Extension 2', version: '1.0.0' }
        },
        {
          id: 'ID_3',
          extensionPath: 'PATH_3',
          packageJSON: { displayName: 'My Extension 3', version: '0.12.1' }
        }
      ]
    },
    workspace: {
      getConfiguration: (key: string) =>
        key === 'changelogChecker' && {
          get: (key: string) =>
            key === 'extensionVersions' && {
              ID_1: '0.8.0',
              ID_2: '0.1.0',
              ID_3: '0.1.0'
            },
          update: () => {}
        }
    },
    commands: { executeCommand: () => {} },
    Uri: { parse: () => {} }
  };

  const fileSystem = td.object(['readDirectory', 'readFile']) as FileSystem;
  td.when(fileSystem.readDirectory('PATH_1')).thenResolve(['CHANGELOG.md']);
  td
    .when(fileSystem.readFile('PATH_1/CHANGELOG.md'))
    .thenResolve(readFileSync('./sample-changelog-1.md'));
  td.when(fileSystem.readDirectory('PATH_2')).thenResolve(['CHANGELOG.md']);
  td
    .when(fileSystem.readFile('PATH_2/CHANGELOG.md'))
    .thenResolve(readFileSync('./sample-changelog-2.md'));
  td.when(fileSystem.readDirectory('PATH_3')).thenResolve(['CHANGELOG.md']);
  td
    .when(fileSystem.readFile('PATH_3/CHANGELOG.md'))
    .thenResolve(readFileSync('./sample-changelog-lv2-heading.md'));
  const commandFactory = new CommandFactory(fileSystem, vscode);
  const main = commandFactory.createMain();

  it('generates a summary', async () => {
    await main.run();
    const result = '';
    assert.deepEqual(result, readFileSync('./sample-report.md'));
  });

  function readFileSync (path: string): string {
    return fsReadFileSync(join('test-data', 'integration', path), 'utf8');
  }
});
