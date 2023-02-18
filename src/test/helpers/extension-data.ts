import {readFileSync} from 'fs';
import {join} from 'path';
import * as vscode from 'vscode';
import {ExtensionContextLike} from '../../lib/types';

export const EXTENSION_METADATA = [
  {
    id: 'ID_1',
    extensionPath: 'PATH_1',
    packageJSON: {
      displayName: 'My Extension 1',
      version: '1.0.0',
      homepage: 'https://github.com/ryu1kn/vscode-extension-update-reporter',
      repository: 'https://github.com/ryu1kn/vscode-extension-update-reporter.git'
    }
  },
  {
    id: 'ID_2',
    extensionPath: 'PATH_2',
    packageJSON: {displayName: 'My Extension 2', version: '1.0.0'}
  },
  {
    id: 'ID_3',
    extensionPath: 'PATH_3',
    packageJSON: {displayName: 'My Extension 3', version: '0.12.1'}
  },
  {
    id: 'ID_4',
    extensionPath: 'PATH_4',
    packageJSON: {displayName: 'My Extension 4', version: '2.0.0'}
  }
] as vscode.Extension<any>[];

export const LAST_RECORDED_VERSIONS = {
  ID_1: '0.8.0',
  ID_2: '0.1.0',
  ID_3: '0.1.0',
  ID_4: '1.0.0'
};

export function createExtensionContext(): ExtensionContextLike {
  return {subscriptions: []};
}

export const EXT1_CHANGELOG = readTestDataFile('sample-changelog-1.md');
export const EXT2_CHANGELOG = readTestDataFile('sample-changelog-2.md');
export const EXT3_CHANGELOG = readTestDataFile('sample-changelog-lv2-heading.md');
export const EXT4_CHANGELOG = readTestDataFile('sample-changelog-table.md');

export function readTestDataFile(path: string): string {
  return readFileSync(join('test-data', 'e2e', path), 'utf8');
}
