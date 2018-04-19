const fs = require('fs')
const vscode = require('vscode')

const FileSystem = require('./lib/file-system')
const ChangeReportGenerator = require('./lib/change-report-generator')

const fileSystem = new FileSystem({ fs })
const changeReportGenerator = new ChangeReportGenerator({
  fileSystem,
  vscExtensions: vscode.extensions
})

exports.activate = async context => {
  await changeReportGenerator.generate()
}

exports.deactivate = () => {}
