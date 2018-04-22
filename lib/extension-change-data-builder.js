const multiline = require('multiline-string')()
const capitalise = word => word[0].toUpperCase() + word.slice(1)

class ExtensionChangeDataBuilder {
  build (extensions) {
    return multiline(`
      # Extension Updates
      
      ${this._buildExtension(extensions)}
      `)
  }

  _buildExtension (extensions) {
    return extensions
      .map(extension =>
        multiline(`
        ## ${extension.displayName}
        ${this._buildVersion(extension.changelog.getUpdatesSince('0.0.0'))}`)
      )
      .join('\n\n')
  }

  _buildVersion (releases) {
    return releases
      .map(release =>
        multiline(`
      ### [${release.version}]
      ${this._buildChangeKind(release.changes)}`)
      )
      .join('\n\n')
  }

  _buildChangeKind (release) {
    return Object.keys(release)
      .filter(changeKind => release[changeKind].length > 0)
      .map(changeKind =>
        multiline(`
        #### ${capitalise(changeKind)}
        ${this._buildChangeItems(release[changeKind])}`)
      )
      .join('\n')
  }

  _buildChangeItems (changeItems) {
    return changeItems.map(changeItem => `- ${changeItem}`).join('\n')
  }
}

module.exports = ExtensionChangeDataBuilder
