const fs = require('fs')
const vscode = require('vscode')

exports.activate = context => {
  const extensions = vscode.extensions.all.filter(
    extension =>
      !(
        extension.isBuiltin ||
        extension.id.startsWith('vscode.') ||
        extension.id.startsWith('ms-vscode.')
      )
  )

  Promise.all(
    extensions
      .map(extension => extension.extensionPath)
      .map(
        extensionPath =>
          new Promise((resolve, reject) =>
            fs.readdir(
              extensionPath,
              (err, data) => (err ? reject(err) : resolve(data))
            )
          )
      )
  ).then(results =>
    results
      .map(extensionToplevelFilenames =>
        extensionToplevelFilenames.find(filename =>
          /CHANGELOG\.(md|txt)/i.test(filename)
        )
      )
      .map(changelog => console.log(changelog))
  )
}

exports.deactivate = () => {}
