import { Change } from '../types';
import {Version} from './version';

export function createChangelog(changes: Change[]) {
  return new Changelog({versions: changes});
}

export class Changelog {
  private raw: {versions: Change[]};

  constructor (raw: {versions: Change[]}) {
    this.raw = raw;
  }

  getUpdatesSince (baseVersion: Version): Change[] {
    return this.raw.versions.filter(
      version => version.version.isHigherThan(baseVersion)
    );
  }
}
