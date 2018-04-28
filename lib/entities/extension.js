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

  shouldReportUpdate (extensionVersions) {
    const id = this.id
    return !(
      this._raw.isBuiltin ||
      id.startsWith('vscode.') ||
      id.startsWith('ms-vscode.') ||
      this.version === extensionVersions[id]
    )
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
