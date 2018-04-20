const fs = require('fs')
const vscode = require('vscode')

const FileSystem = require('./lib/file-system')
const ChangelogLoader = require('./lib/changelog-loader')
const DispalyReportCommand = require('./lib/display-report-command')

const fileSystem = new FileSystem({ fs })
const changelogLoader = new ChangelogLoader({ fileSystem })
const displayReportCommand = new DispalyReportCommand({
  changelogLoader,
  vscExtensions: vscode.extensions
})

exports.activate = async context => {
  const result = await displayReportCommand.execute()
  console.log(result)
}

exports.deactivate = () => {}
