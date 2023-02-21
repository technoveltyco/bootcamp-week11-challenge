import fs from "fs/promises";
import * as fsSync from "fs";
import path from "path";
import { Remarkable } from "remarkable";
import toc from "markdown-toc";

/**
 * @type {Object}
 *    The default generator settings.
 */
const settings = {
  readmeFilename: "README",
  templatesFolder: path.resolve("./../templates/partials/"),
  downloadsFolder: path.resolve("./.downloads/"),
  md: {
    headings: {
      description: "Description",
      toc: "Table of Contents",
      installation: "Installation",
      usage: "Usage",
      license: "License",
      contributing: "Contributing",
      tests: "Tests",
      questions: "Questions",
    },
  },
};

/**
 * @type {Object}
 *    The default markdown parser settings.
 */
const parserSettings = {
  html: false, // Enable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br />)
  breaks: false, // Convert '\n' in paragraphs into <br>
  langPrefix: "language-", // CSS language prefix for fenced blocks

  // Enable some language-neutral replacement + quotes beautification
  typographer: false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
  quotes: "“”‘’",
};

/**
 * @type {Remarkable}
 *    The markdown parser.
 */
const md = new Remarkable(parserSettings);

/**
 * Sets configuration settings.
 *
 * @param {{ generator: Object, parser: Object }} settings
 *    The generator settings.
 *    The markdown parser settings.
 */
function setSettings({ generator, parser }) {
  // Update system settings
  for (const key in generator) {
    if (Object.hasOwnProperty.call(generator, key)) {
      settings[key] = generator[key];
    }
  }

  // Update markdown parser settings.
  for (const key in parser) {
    if (Object.hasOwnProperty.call(parserSettings, key)) {
      parserSettings[key] = parser[key];
    }
  }
  md.set(parserSettings);
}

/**
 * Gets the markdown template and render the given content.
 *
 * @param {string} section
 *    The section id.
 * @param {string|null} content
 *    The content to render.
 * @returns {string}
 *    The rendered markdown.
 */
async function renderMarkdownTemplate(section, content = null) {
  let markdown = "";

  const templateId = section.toUpperCase();
  const filePath = `${settings.templatesFolder}/${templateId}.md`;

  // Check if the file exists in the current directory, and if it is readable.
  if (
    typeof (await fs.access(
      filePath,
      fs.constants.F_OK | fs.constants.R_OK
    )) !== "undefined"
  ) {
    // nop ...
    console.error(
      `The template with id "${templateId}" does not exists or is not readable.`
    );
    return markdown;
  }

  let template = await fs.readFile(filePath, { encoding: "utf8" });

  // Add content in the markdown section token.
  const token = `<!-- ${section} -->`;
  if (section === "toc") {
    // Generates the markdown toc.
    const tocMdContent = toc(content).content;
    markdown += template.replace(token, tocMdContent);
  } else if (content) {
    markdown += template.replace(token, content);
  } else {
    markdown = template;
  }

  return markdown;
}

/**
 * Parses the given markdown into HTML.
 *
 * @param {string} markdown
 *    The markdown to parse.
 * @returns {string}
 *    The parsed HTML output.
 */
function parseMarkdown(markdown) {
  let html = "";
  html = md.render(markdown);
  return html;
}

/**
 * Generates the table of contents, given the sections.
 *
 * @param {Array} sections
 *    The section ids.
 * @returns {Array}
 *    The toc in markdown and parsed HTML.
 */
async function generateMdToc(sections) {
  let markdown = "";
  let html = "";
  let tocMd = "";

  const headings = sections.reduce((tocMd, heading, index) => {
    heading = settings.md.headings[heading] || heading;
    tocMd += index === 0 ? `# ${heading}` : `\n## ${heading}`;
    return tocMd;
  }, tocMd);

  markdown = await renderMarkdownTemplate("toc", headings);
  html = parseMarkdown(markdown);

  return [markdown, html];
}

/**
 * function to generate markdown for README.
 *
 * @param {Object} data
 *    The README object.
 * @returns {Array}
 *    The filepaths of the markdown and parsed HTML.
 */
async function generateMarkdown(data) {
  // Create ./.downloads/ if does not exists.
  if (!fsSync.existsSync(settings.downloadsFolder)) {
    await fs.mkdir(settings.downloadsFolder);
  }

  const timestamp = Date.now();
  const mdFilePath = `${settings.downloadsFolder}/${timestamp}-${settings.readmeFilename}.md`;
  const htmlFilePath = `${settings.downloadsFolder}/${timestamp}-${settings.readmeFilename}.html`;

  // File stream writers.
  const mdOutput = fsSync.createWriteStream(mdFilePath);
  const htmlOutput = fsSync.createWriteStream(htmlFilePath);

  // Headers and footers.
  const mdHeader = await renderMarkdownTemplate("header", null);
  const htmlHeadWrapper = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>README | Generated by README Generator</title>
  </head>
  <body>  
`;
  const htmlFootWrapper = ` </body>
</html>
`;

  mdOutput.write(mdHeader);
  htmlOutput.write(htmlHeadWrapper);
  htmlOutput.write(mdHeader);

  // Render document sections.
  for (const section in data) {
    if (Object.hasOwnProperty.call(data, section)) {
      const content = data[section];

      // Generate ToC.
      if (section === "toc") {
        let headings = Object.keys(data);

        // Replace the title key with the user's input value.
        const titleIndex = headings.indexOf("title");
        if (titleIndex >= 0) {
          headings[titleIndex] = data["title"];
        }

        const [tocMarkdown, tocHtml] = await generateMdToc(headings);
        mdOutput.write(tocMarkdown);
        htmlOutput.write(tocHtml);
        continue;
      }

      const markdown = await renderMarkdownTemplate(section, content);
      mdOutput.write(markdown);

      const html = parseMarkdown(markdown);
      htmlOutput.write(html);
    }
  }

  // Wrap the HTML with the footer.
  htmlOutput.write(htmlFootWrapper);

  return [mdFilePath, htmlFilePath];
}

export { setSettings, generateMarkdown };
