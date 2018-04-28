const Extension = require('./entities/extension')
const { EXTENSION_NAME } = require('./const')

class Main {
  constructor (params) {
    this._vscode = params.vscode
    this._configStore = params.configStore
    this._extensionStore = params.extensionStore
  }

  async run () {
    const uri = this._vscode.Uri.parse(`${EXTENSION_NAME}:show-updates-summary`)
    const extensions = this._getExtensions()
    await this._configStore.registerAllExtensions(
      this._getExtensionVersionMap(extensions)
    )

    const newExtensionVerions = this._configStore.extensionVersions
    const updatedExtensions = extensions.filter(extension =>
      extension.shouldReportUpdate(newExtensionVerions)
    )
    if (updatedExtensions.length > 0) {
      this._extensionStore.set(updatedExtensions)
      await this._vscode.commands.executeCommand(
        'vscode.previewHtml',
        uri,
        undefined,
        'Exntension Update Report'
      )
    }
  }

  _getExtensionVersionMap (extensions) {
    return extensions.reduce(
      (map, extension) =>
        Object.assign({}, map, { [extension.id]: extension.version }),
      {}
    )
  }

  _getExtensions () {
    return this._vscode.extensions.all
      .map(extension => new Extension(extension))
      .filter(extension => !extension.isVscodeBundled)
  }
}

module.exports = Main
