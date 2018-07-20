import {readFileSync} from 'fs';
import {join} from 'path';

export const EXT1_CHANGELOG = readTestDataFile('sample-changelog-1.md');
export const EXT2_CHANGELOG = readTestDataFile('sample-changelog-2.md');
export const EXT3_CHANGELOG = readTestDataFile('sample-changelog-lv2-heading.md');

export function readTestDataFile(path: string): string {
  return readFileSync(join('test-data', 'e2e', path), 'utf8');
}
