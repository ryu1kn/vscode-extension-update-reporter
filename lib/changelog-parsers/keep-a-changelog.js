const Changelog = require('../entities/changelog')

class KeepAChangelogParser {
  isOfType (changelog) {
    return changelog.includes('://keepachangelog.com')
  }

  parse (changelog, _knownVersion) {
    const rawVersions = this._splitIntoVersions(changelog)
    const versions = rawVersions.map(rawVersion => ({
      version: rawVersion.version,
      changeText: this._reviseHeadingLevel(rawVersion.contents)
    }))
    return new Changelog({ versions })
  }

  _splitIntoVersions (changelog, _versionHeading) {
    const versionHeadingPattern = /^## \[(\d+\.\d+\.\d+)\].*/m
    const [, ...match] = changelog.split(versionHeadingPattern)
    return match.reduce((accumulated, value, index) => {
      const isHeading = index % 2 === 0
      if (isHeading) {
        return [...accumulated, { version: value }]
      }
      return [
        ...accumulated.slice(0, -1),
        Object.assign({}, accumulated.slice(-1)[0], { contents: value.trim() })
      ]
    }, [])
  }

  _reviseHeadingLevel (contents) {
    return contents.replace(/^(#{3,} )/gm, '#$1')
  }
}

module.exports = KeepAChangelogParser
