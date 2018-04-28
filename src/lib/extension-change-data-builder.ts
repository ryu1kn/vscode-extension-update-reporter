const multiline = require('multiline-string')()

class ExtensionChangeDataBuilder {
  build (extensions: any, extensionVersions: any) {
    return multiline(`
      # Extension Updates

      ${this._buildExtension(extensions, extensionVersions)}
      `)
  }

  _buildExtension (extensions: any, extensionVersions: any) {
    return extensions
      .map((extension: any) =>
        multiline(`
        ## ${extension.displayName}
        ${this._buildChangelog(
    extension.changelog,
    extensionVersions[extension.id]
  )}`)
      )
      .join('\n\n')
  }

  _buildChangelog (changelog: any, extensionVersion: any) {
    return changelog
      ? this._buildVersion(changelog.getUpdatesSince(extensionVersion))
      : 'Changelog not found or cannot be parsed as [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).'
  }

  _buildVersion (releases: any) {
    return releases
      .map((release: any) =>
        multiline(`
      ### [${release.version}]
      ${release.changeText}`)
      )
      .join('\n\n')
  }
}

export default ExtensionChangeDataBuilder
