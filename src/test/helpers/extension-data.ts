import {readFileSync} from 'fs';
import {join} from 'path';
import * as vscode from 'vscode';
import {ExtensionContextLike} from '../../lib/types';

export const EXTENSION_METADATA = [
  {
    id: 'extensionId1',
    extensionPath: 'PATH_1',
    packageJSON: {displayName: 'My Extension 1', version: '1.0.0'}
  },
  {
    id: 'extensionId2',
    extensionPath: 'PATH_2',
    packageJSON: {displayName: 'My Extension 2', version: '1.0.0'}
  },
  {
    id: 'extensionId3',
    extensionPath: 'PATH_3',
    packageJSON: {displayName: 'My Extension 3', version: '0.12.1'}
  }
] as vscode.Extension<any>[];

export const LAST_RECORDED_VERSIONS = {
  extensionId1: '0.8.0',
  extensionId2: '0.1.0',
  extensionId3: '0.1.0'
};

export function createExtensionContext(): ExtensionContextLike {
  return {subscriptions: []};
}

export const EXT1_CHANGELOG = readTestDataFile('sample-changelog-1.md');
export const EXT2_CHANGELOG = readTestDataFile('sample-changelog-2.md');
export const EXT3_CHANGELOG = readTestDataFile('sample-changelog-lv2-heading.md');

export function readTestDataFile(path: string): string {
  return readFileSync(join('test-data', 'e2e', path), 'utf8');
}
