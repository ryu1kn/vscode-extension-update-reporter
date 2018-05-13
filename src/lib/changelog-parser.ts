import {Changelog, createChangelog} from './entities/changelog';
import {Change} from './types';
import {isValidVersion, parseVersion, Version} from './entities/version';
import {toTuples} from './utils/collection';
import {escape as escapeRegex} from './utils/regex';
import {Either, left, right} from 'fp-ts/lib/Either';

export default class ChangelogParser {
  parse (changelog: string, knownVersion: Version): Either<string, Changelog> {
    const heading = this.findVersionHeading(changelog, knownVersion);
    if (!heading) return left('Failed to parse the changelog file.');

    return right(createChangelog(this.splitIntoVersions(changelog, heading)));
  }

  private findVersionHeading (changelog: string, knownVersion: Version) {
    const match = changelog.match(new RegExp(`^(#+ +.*)${escapeRegex(knownVersion.toString())}`, 'm'));
    return match && match[1];
  }

  private splitIntoVersions (changelog: string, versionHeading: string): Change[] {
    const versionHeadingPattern = new RegExp(`^${escapeRegex(versionHeading)}(.*)`, 'm');
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

