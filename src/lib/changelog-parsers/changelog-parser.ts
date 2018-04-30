import {Changelog} from '../entities/changelog';
import {Version} from '../entities/version';

export interface ChangelogParser {
  isOfType (changelog: string): boolean;
  parse (changelog: string, knownVersion: Version): Changelog;
}

