import Changelog from '../entities/changelog';

class KeepAChangelogParser {
  isOfType (changelog: string) {
    return changelog.includes('://keepachangelog.com');
  }

  parse (changelog: string, _knownVersion: string) {
    const rawVersions = this._splitIntoVersions(changelog);
    const versions = rawVersions.map((rawVersion: any) => ({
      version: rawVersion.version,
      changeText: this._reviseHeadingLevel(rawVersion.contents)
    }));
    return new Changelog({ versions });
  }

  _splitIntoVersions (changelog: string) {
    const versionHeadingPattern = /^## \[(\d+\.\d+\.\d+)\].*/m;
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

  _reviseHeadingLevel (contents: string) {
    return contents.replace(/^(#{3,} )/gm, '#$1');
  }
}

export default KeepAChangelogParser;
