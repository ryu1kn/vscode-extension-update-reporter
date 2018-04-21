const Changelog = require('./changelog')
const parseChangelog = require('keep-a-changelog').parser

class ChangelogParser {
  parse (changelog) {
    return new Changelog(parseChangelog(changelog))
  }
}

module.exports = ChangelogParser
