class ChangeReportGenerator {
  constructor (params) {
    this._vscExtensions = params.vscExtensions
    this._changelogLoader = params.changelogLoader
  }

  get _allExtensions () {
    return this._vscExtensions.all
  }

  generate () {
    const extensions = this._collectTargetExtensions(this._allExtensions)

    return Promise.all(
      extensions
        .map(extension => extension.extensionPath)
        .map(extensionPath => this._changelogLoader.load(extensionPath))
    )
  }

  _collectTargetExtensions (extensions) {
    return extensions.filter(
      extension =>
        !(
          extension.isBuiltin ||
          extension.id.startsWith('vscode.') ||
          extension.id.startsWith('ms-vscode.')
        )
    )
  }
}

module.exports = ChangeReportGenerator
