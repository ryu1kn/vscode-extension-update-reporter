import Changelog from '../entities/changelog';

class DefaultChangelogParser {
  isOfType (changelog: string) {
    return true;
  }

  parse (changelog: string, knownVersion: string) {
    const heading = this._findVersionHeading(changelog, knownVersion);
    if (!heading) { return null; }

    const rawVersions = this._splitIntoVersions(changelog, heading);
    const versions = rawVersions.map((rawVersion: any) => ({
      version: rawVersion.version,
      changeText: rawVersion.contents
    }));
    return new Changelog({ versions });
  }

  _findVersionHeading (changelog: string, knownVersion: string) {
    const match = changelog.match(new RegExp(`^(#+ *)${knownVersion}`, 'm'));
    return match && match[1];
  }

  _splitIntoVersions (changelog: string, versionHeading: string) {
    const versionHeadingPattern = new RegExp(`^${versionHeading}(.*)`, 'm');
    const [, ...match] = changelog.split(versionHeadingPattern);
    return match.reduce((accumulated: any, value, index) => {
      const isHeading = index % 2 === 0;
      if (isHeading) {
        return [...accumulated, { version: value }];
      }
      return [
        ...accumulated.slice(0, -1),
        Object.assign({}, accumulated.slice(-1)[0], { contents: value.trim() })
      ];
    }, []);
  }
}

export default DefaultChangelogParser;
