import { Change } from '../types';
import {Version} from './version';

export default class Changelog {
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
