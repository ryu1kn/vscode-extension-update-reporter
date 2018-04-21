class Extension {
  constructor ({ raw, changelog }) {
    this._raw = raw
    this._changelog = changelog
  }

  isUpdated (version) {
    return this._raw.packageJSON.version > version
  }

  get displayName () {
    return this._raw.packageJSON.displayName
  }

  get changelog () {
    return this._changelog
  }
}

module.exports = Extension
