import {PreloadedExtension} from './entities/extension';
import ChangelogAssigner from './changelog-assigner';
import MarkdownReportBuilder from './markdown-report-builder';

const markdownReportBuilder = new MarkdownReportBuilder();

export default class MarkdownReportGenerator {
  private readonly changelogAssigner: ChangelogAssigner;

  constructor(changelogAssigner: ChangelogAssigner) {
    this.changelogAssigner = changelogAssigner;
  }

  async generate(extensions: PreloadedExtension[]): Promise<string> {
    const loadedExtensions = await this.changelogAssigner.assign(extensions);
    return markdownReportBuilder.build(loadedExtensions);
  }

}
