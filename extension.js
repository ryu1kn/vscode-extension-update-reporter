const fs = require('fs')
const vscode = require('vscode')

const FileSystem = require('./lib/file-system')
const ChangelogLoader = require('./lib/changelog-loader')
const ChangeReportGenerator = require('./lib/change-report-generator')

const fileSystem = new FileSystem({ fs })
const changelogLoader = new ChangelogLoader({ fileSystem })
const changeReportGenerator = new ChangeReportGenerator({
  changelogLoader,
  vscExtensions: vscode.extensions
})

exports.activate = async context => {
  const result = await changeReportGenerator.generate()
  console.log(result)
}

exports.deactivate = () => {}
