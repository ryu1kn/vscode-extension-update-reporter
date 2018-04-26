const ChangelogLoader = require('./changelog-loader')
const ChangelogParser = require('./changelog-parser')
const ConfigStore = require('./config-store')
const ExtensionUpdatesReportGenerator = require('./extension-updates-report-generator')

class CommandFactory {
  constructor (params) {
    this._fileSystem = params.fileSystem
    this._vscode = params.vscode
  }

  create () {
    const changelogParser = new ChangelogParser()
    const changelogLoader = new ChangelogLoader({
      changelogParser,
      fileSystem: this._fileSystem
    })
    const configStore = new ConfigStore({
      vscWorkspace: this._vscode.workspace
    })
    return new ExtensionUpdatesReportGenerator({
      changelogLoader,
      configStore,
      vscExtensions: this._vscode.extensions
    })
  }
}

module.exports = CommandFactory
