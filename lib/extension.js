class Extension {
  constructor (raw) {
    this._raw = raw
  }

  get id () {
    return this._raw.id
  }

  get displayName () {
    const packageJson = this._raw.packageJSON
    return packageJson.displayName || packageJson.name
  }

  get version () {
    return this._raw.packageJSON.version
  }

  get extensionPath () {
    return this._raw.extensionPath
  }

  get changelog () {
    return this._changelog
  }

  set changelog (changelog) {
    this._changelog = changelog
  }
}

module.exports = Extension
