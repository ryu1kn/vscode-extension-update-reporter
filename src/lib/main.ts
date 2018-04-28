import Extension from './entities/extension'
const { EXTENSION_NAME } = require('./const')

class Main {
  private _vscode: any
  private _configStore: any
  private _extensionStore: any

  constructor (params: any) {
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
    const updatedExtensions = extensions.filter((extension: any) =>
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

  _getExtensionVersionMap (extensions: any) {
    return extensions.reduce(
      (map: any, extension: any) =>
        Object.assign({}, map, { [extension.id]: extension.version }),
      {}
    )
  }

  _getExtensions () {
    return this._vscode.extensions.all
      .map((extension: any) => new Extension(extension))
      .filter((extension: any) => !extension.isVscodeBundled)
  }
}

export default Main
