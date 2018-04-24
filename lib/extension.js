class Extension {
  constructor ({ raw, changelog }) {
    this._raw = raw
    this._changelog = changelog
  }

  get displayName () {
    const packageJson = this._raw.packageJSON
    return packageJson.displayName || packageJson.name
  }

  get changelog () {
    return this._changelog
  }
}

module.exports = Extension
