import ChangelogLoader from './changelog-loader'
import ChangelogParser from './changelog-parser'
import ConfigStore from './config-store'
import ExtensionStore from './extension-store'
import ExtensionUpdatesReportGenerator from './extension-updates-report-generator'
import Main from './main'

class CommandFactory {
  private _fileSystem: any
  private _vscode: any
  private _cache: any

  constructor (params: any) {
    this._fileSystem = params.fileSystem
    this._vscode = params.vscode

    this._cache = new Map()
  }

  createReportGenerator () {
    const changelogParser = new ChangelogParser()
    const changelogLoader = new ChangelogLoader({
      changelogParser,
      fileSystem: this._fileSystem
    })
    return new ExtensionUpdatesReportGenerator({
      changelogLoader,
      configStore: this._getConfigStore(),
      extensionStore: this._getExtensionStore()
    })
  }

  createMain () {
    return new Main({
      vscode: this._vscode,
      configStore: this._getConfigStore(),
      extensionStore: this._getExtensionStore()
    })
  }

  _getConfigStore () {
    return this._getCached(
      'configStore',
      () =>
        new ConfigStore({
          vscWorkspace: this._vscode.workspace
        })
    )
  }

  _getExtensionStore () {
    return this._getCached('extensionStore', () => new ExtensionStore())
  }

  _getCached (key: string, createFunction: any) {
    if (!this._cache.has(key)) {
      this._cache.set(key, createFunction())
    }
    return this._cache.get(key)
  }
}

export default CommandFactory
