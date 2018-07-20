import {PreloadedExtension} from './entities/extension';
import ChangelogLoader from './changelog-loader';
import MarkdownReportBuilder from './markdown-report-builder';

const markdownReportBuilder = new MarkdownReportBuilder();

export default class MarkdownReportGenerator {
  private readonly changelogLoader: ChangelogLoader;

  constructor(changelogLoader: ChangelogLoader) {
    this.changelogLoader = changelogLoader;
  }

  async generate(extensions: PreloadedExtension[]): Promise<string> {
    const promiseOfLoadedExtensions = extensions.map(extension => this.changelogLoader.load(extension));
    const loadedExtensions = await Promise.all(promiseOfLoadedExtensions);
    return markdownReportBuilder.build(loadedExtensions);
  }

}
