const ChangelogLoader = require('./changelog-loader')
const ChangelogParser = require('./changelog-parser')
const ConfigStore = require('./config-store')
const ExtensionStore = require('./extension-store')
const ExtensionUpdatesReportGenerator = require('./extension-updates-report-generator')
const Main = require('./main')

class CommandFactory {
  constructor (params) {
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

  _getCached (key, createFunction) {
    if (!this._cache.has(key)) {
      this._cache.set(key, createFunction())
    }
    return this._cache.get(key)
  }
}

module.exports = CommandFactory
