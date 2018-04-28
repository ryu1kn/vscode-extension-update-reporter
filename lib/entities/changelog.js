class Changelog {
  constructor (raw) {
    this._raw = raw
  }

  getUpdatesSince (baseVersion) {
    const newerVersions = this._raw.versions.filter(
      version => version.version > baseVersion
    )
    return newerVersions
  }
}

module.exports = Changelog
