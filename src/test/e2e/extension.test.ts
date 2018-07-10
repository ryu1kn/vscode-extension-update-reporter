import * as assert from 'assert';
import {mock, when} from '../helper';

import CommandFactory from '../../lib/command-factory';
import FileSystem from '../../lib/file-system';
import { readFileSync as fsReadFileSync } from 'fs';
import { join } from 'path';

describe('End to End', () => {
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
        key === 'extensionUpdateReporter' && {
          get: (key: string) =>
            key === 'lastCheckedVersions' && {
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

  const fileSystem = mock(FileSystem);
  when(fileSystem.readFile('PATH_1/CHANGELOG.md'))
    .thenResolve(readFileSync('./sample-changelog-1.md'));
  when(fileSystem.readFile('PATH_2/CHANGELOG.md'))
    .thenResolve(readFileSync('./sample-changelog-2.md'));
  when(fileSystem.readFile('PATH_3/CHANGELOG.md'))
    .thenResolve(readFileSync('./sample-changelog-lv2-heading.md'));
  const commandFactory = new CommandFactory(fileSystem, vscode);
  const main = commandFactory.createMain();
  const contentProvider = commandFactory.createContentProvider();

  it('generates a summary', async () => {
    await main.run();
    const html = await contentProvider.provideTextDocumentContent();
    assert.deepEqual(html, readFileSync('./sample-report.html'));
  });

  function readFileSync (path: string): string {
    return fsReadFileSync(join('test-data', 'e2e', path), 'utf8');
  }
});
