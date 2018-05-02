const md = require('markdown-it')();
const multiline = require('multiline-string')();

export default class MarkdownToHtmlConverter {
  convert (markdownReport: string): string {
    return multiline(`
      <html lang="en">
        <head>
          <meta http-equiv="Content-Security-Policy"
              content="default-src 'none'; img-src *; style-src 'sha256-WfeEgJ1vUKDPEVQf8Wp4SY90PGXZ3IJBfeBANM0l2QE='; script-src 'none';">
          <style>
            html {
              font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
            }
            body {
              line-height: 1.5;
              color: #24292e;
              font-size: 14px;
              word-wrap: break-word;
            }

            h1 {
              margin-top: 24px;
              margin-bottom: 16px;
              font-weight: 600;
              line-height: 1.25;
              padding-bottom: 0.3em;
              font-size: 2em;
              border-bottom: 1px solid #eaecef;
            }

            h2 {
              margin-top: 24px;
              margin-bottom: 16px;
              font-weight: 600;
              line-height: 1.25;
              padding-bottom: 0.3em;
              font-size: 1.5em;
              border-bottom: 1px solid #eaecef;
            }

            h3 {
              margin-top: 24px;
              margin-bottom: 16px;
              font-weight: 600;
              line-height: 1.25;
              font-size: 1.25em;
            }

            p {
              margin-top: 0;
              margin-bottom: 16px;
            }

            pre {
              font-family: source-code-pro,Menlo,Monaco,Consolas,"Courier New",monospace;
              padding: 16px;
              overflow: auto;
              font-size: 85%;
              line-height: 1.45;
              background-color: #f6f8fa;
              border-radius: 3px;
              margin-top: 0;
              margin-bottom: 0;
              word-wrap: normal;
            }

            code {
              font-family: source-code-pro,Menlo,Monaco,Consolas,"Courier New",monospace;
              padding: 0.2em 0.4em;
              margin: 0;
              font-size: 85%;
              background-color: rgba(27,31,35,0.05);
              border-radius: 3px;
            }
          </style>
        </head>
        <body>
          ${md.render(markdownReport)}
        </body>
      </html>`);
  }
}
