import { Change } from '../types';
import {Version} from './version';

export interface Changelog {
  isValid: boolean;
  getUpdatesSince(baseVersion: Version): Change[];
}

export function createValidChangelog(changes: Change[]) {
  return new ValidChangelog({versions: changes});
}

export function createInvalidChangelog() {
  return new InvalidChangelog();
}

export class ValidChangelog implements Changelog {
  constructor(private readonly raw: { versions: Change[] }) {}

  get isValid() {
    return true;
  }

  getUpdatesSince(baseVersion: Version) {
    return this.raw.versions.filter(
      version => version.version.isHigherThan(baseVersion)
    );
  }
}

export class InvalidChangelog implements Changelog {
  get isValid() {
    return false;
  }

  getUpdatesSince() {
    return [];
  }
}
