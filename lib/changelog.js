class Changelog {
  constructor (raw) {
    this._raw = raw
  }

  getUpdatesSince (baseVersion) {
    const newerVersions = this._raw.releases.filter(
      release => release.version.raw > baseVersion
    )
    return newerVersions.map(release => ({
      changes: this._pickTitles(release.changes),
      version: release.version.raw
    }))
  }

  _pickTitles (changes) {
    return Object.keys(changes).reduce(
      (newChanges, changeKind) =>
        Object.assign({}, newChanges, {
          [changeKind]: changes[changeKind].map(item => item.title)
        }),
      {}
    )
  }
}

module.exports = Changelog
