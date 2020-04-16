import MarkdownToHtmlConverter from './markdown-to-html-converter';
import MarkdownReportGenerator from './markdown-report-generator';
import {PreloadedExtension} from './entities/extension';

const markdownToHtmlConverter = new MarkdownToHtmlConverter();

export default class ContentProvider {
  constructor(private readonly markdownReportGenerator: MarkdownReportGenerator) {}

  async provideTextDocumentContent(updatedExtensions: PreloadedExtension[]) {
    const markdownReport = await this.markdownReportGenerator.generate(updatedExtensions);
    return markdownToHtmlConverter.convert(markdownReport);
  }
}
