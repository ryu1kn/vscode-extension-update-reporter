class ChangeReportGenerator {
  constructor (params) {
    this._vscExtensions = params.vscExtensions
    this._fileSystem = params.fileSystem
  }

  get _allExtensions () {
    return this._vscExtensions.all
  }

  generate () {
    const extensions = this._collectTargetExtensions(this._allExtensions)

    return Promise.all(
      extensions
        .map(extension => extension.extensionPath)
        .map(extensionPath => this._fileSystem.readDirectory(extensionPath))
    ).then(results =>
      results.map(extensionToplevelFilenames =>
        extensionToplevelFilenames.find(filename =>
          /CHANGELOG\.(md|txt)/i.test(filename)
        )
      )
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
