import ChangelogLoader from './changelog-loader';
import ChangelogParser from './changelog-parser';
import FileSystem from './file-system';
import MarkdownReportGenerator from './markdown-report-generator';

export default class MarkdownReportGeneratorFactory {
  constructor(private readonly fileSystem: FileSystem) {}

  create() {
    const changelogParser = new ChangelogParser();
    const changelogLoader = new ChangelogLoader(this.fileSystem, changelogParser);
    return new MarkdownReportGenerator(changelogLoader);
  }
}
