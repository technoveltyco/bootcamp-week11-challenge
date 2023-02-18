import fs from "fs/promises";
import path from "path";
import { Remarkable } from "remarkable";
import hljs from "highlight.js";
// import toc from "markdown-toc";

/**
 * @type {Object}
 *    The default generator settings.
 */
const settings = {
  readmeFilename: "README",
  templatesFolder: path.resolve("./../templates/partials/"),
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
 * Writes the README file.
 *
 * @param {string} fileName
 *    The filename of the README.
 * @param {Object|Array|string} data
 *    The data to dump into the file.
 */
function writeToFile(fileName, data) {}

/**
 * Gets the markdown template and render the given content.
 *
 * @param {string} section
 *    The section id.
 * @param {string} content
 *    The content to render.
 * @returns {string}
 *    The rendered markdown.
 */
async function renderMarkdownTemplate(section, content) {
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

  if (content) {
    markdown += template.replace(`<!-- ${section} -->`, content);
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

// function to generate markdown for README
async function generateMarkdown(data) {
  let markdown = "";
  let html = "";

  // Render header
  markdown = await renderMarkdownTemplate("header", null);

  // Render document sections.
  for (const section in data) {
    if (Object.hasOwnProperty.call(data, section)) {
      const content = data[section];
      markdown += await renderMarkdownTemplate(section, content);
    }
  }

  html = parseMarkdown(markdown);

  return [markdown, html];
}

export { setSettings, generateMarkdown };
