import {PreloadedExtension} from './entities/extension';
import ChangelogLoader from './changelog-loader';
import MarkdownReportBuilder from './markdown-report-builder';

const markdownReportBuilder = new MarkdownReportBuilder();

export default class MarkdownReportGenerator {
  constructor(private readonly changelogLoader: ChangelogLoader) {}

  async generate(extensions: PreloadedExtension[]): Promise<string> {
    const promiseOfLoadedExtensions = extensions.map(extension => this.changelogLoader.load(extension));
    const loadedExtensions = await Promise.all(promiseOfLoadedExtensions);
    return markdownReportBuilder.build(loadedExtensions);
  }

}
