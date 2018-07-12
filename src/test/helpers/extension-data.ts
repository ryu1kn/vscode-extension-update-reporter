import {readFileSync} from 'fs';
import {join} from 'path';

export const vscode = {
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

export const EXT1_CHANGELOG = readTestDataFile('sample-changelog-1.md');
export const EXT2_CHANGELOG = readTestDataFile('sample-changelog-2.md');
export const EXT3_CHANGELOG = readTestDataFile('sample-changelog-lv2-heading.md');

export function readTestDataFile(path: string): string {
  return readFileSync(join('test-data', 'e2e', path), 'utf8');
}
