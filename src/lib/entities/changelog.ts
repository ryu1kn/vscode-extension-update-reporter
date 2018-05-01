import { Change } from '../types';
import {Version} from './version';

export interface Changelog {
  getUpdatesSince (baseVersion: Version): Change[];
}

export class DefaultChangelog implements Changelog {
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

export class NullChangelog implements Changelog {
  getUpdatesSince (baseVersion: Version): Change[] {
    return [];
  }
}
