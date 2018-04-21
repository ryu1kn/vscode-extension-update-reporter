const ChangelogLoader = require('./changelog-loader')
const ChangelogParser = require('./changelog-parser')
const DispalyReportCommand = require('./display-report-command')

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
    return new DispalyReportCommand({
      changelogLoader,
      vscExtensions: this._vscode.extensions
    })
  }
}

module.exports = CommandFactory
