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
    const extensions = this._getTargetExtensions()
    if (extensions.length > 0) {
      this._extensionStore.set(extensions)
      await this._vscode.commands.executeCommand(
        'vscode.previewHtml',
        uri,
        undefined,
        'Exntension Update Report'
      )
    }
  }

  _getTargetExtensions () {
    const extensions = this._vscode.extensions.all.map(
      extension => new Extension(extension)
    )
    return extensions.filter(extension =>
      extension.shouldReportUpdate(this._configStore.extensionVersions)
    )
  }
}

module.exports = Main
