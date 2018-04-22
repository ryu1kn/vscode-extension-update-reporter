const Changelog = require('./changelog')
const parseChangelog = require('keep-a-changelog').parser

class ChangelogParser {
  parse (changelog) {
    try {
      const parsedChangelog = parseChangelog(changelog)
      return (
        parsedChangelog &&
        parsedChangelog.releases.length > 0 &&
        new Changelog(parsedChangelog)
      )
    } catch (e) {
      console.log(e.stack)
    }
  }
}

module.exports = ChangelogParser
