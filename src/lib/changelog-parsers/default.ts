import { ChangelogParser } from './changelog-parser';
import { Change } from '../types';
import {DefaultChangelog, NullChangelog} from '../entities/changelog';
import {isValidVersion, parseVersion, Version} from '../entities/version';
import {toTuples} from '../utils';

export default class DefaultChangelogParser implements ChangelogParser {
  isOfType (changelog: string) {
    return true;
  }

  parse (changelog: string, knownVersion: Version) {
    const heading = this.findVersionHeading(changelog, knownVersion);
    if (!heading) { return new NullChangelog(); }

    const rawVersions = this.splitIntoVersions(changelog, heading);
    return new DefaultChangelog({ versions: rawVersions });
  }

  private findVersionHeading (changelog: string, knownVersion: Version) {
    const match = changelog.match(new RegExp(`^(#+ *)${knownVersion}`, 'm'));
    return match && match[1];
  }

  private splitIntoVersions (changelog: string, versionHeading: string): Change[] {
    const versionHeadingPattern = new RegExp(`^${versionHeading}(.*)`, 'm');
    const [, ...match] = changelog.split(versionHeadingPattern);
    const tuples = toTuples(match);
    const changes = [];
    for (let i = 0 ; i < tuples.length; i ++) {
      const next = tuples[i + 1];
      if (next && !isValidVersion(next[0])) {
        changes.push({
          version: parseVersion(tuples[i][0]),
          changeText: [tuples[i][1], versionHeading, next[0], next[1]].join('').trim()
        });
        i ++;
      } else {
        changes.push({
          version: parseVersion(tuples[i][0]),
          changeText: tuples[i][1].trim()
        });
      }
    }
    return changes;
  }
}
