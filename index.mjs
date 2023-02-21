import fs from "fs/promises";
import * as fsSync from "fs";
import path from "path";
import archiver from "archiver";
import inquirer from "inquirer";
import { setSettings, generateMarkdown } from "./utils/generateMarkdown.mjs";

/**
 * @type {boolean}
 *    The generated flag.
 */
let generated = false;

/**
 * @type {Array[string]}
 *    The sections available to choose for the README.
 */
const sectionsChoices = [
  "title",
  "description",
  "toc",
  "installation",
  "usage",
  "license",
  "contributing",
  "tests",
  "questions",
];

const licensesChoices = [
  "Apache License 2.0",
  "Boost Software License 1.0",
  "GNU AGPLv3",
  "GNU GPLv3",
  "GNU LGPLv3",
  "Mozilla Public License 2.0",
  "MIT License",
  "The Unlicense",
];

/**
 * @type {[Object]}
 *    The sections question.
 */
const sectionsQuestions = [
  {
    name: "sections",
    type: "rawlist",
    message: "Choose a section or select [Next] to continue:",
    choices: [...sectionsChoices, "next"],
    transformer(input) {
      if (input === "next") {
        input += " ->";
      } else if (input === "toc") {
        return "Table of Contents";
      } else if (input === "questions") {
        return "FAQs";
      }
      input[0].toUpperCase();
      return input;
    },
  },
];

/**
 * The questions to generate each section of the README.
 *
 * @type {{ title: [Object], installation: [Object], usage: [Object], license: [Object], contributing: [Object], tests: [Object], questions: [Object] }}
 */
const readmeQuestions = {
  title: [
    {
      type: "input",
      name: "title",
      message: "What's the title of your project?",
      validate(input) {
        if (input.lenght < 3) {
          return "Title should be at least 3 characters long.";
        }
        return true;
      },
    },
  ],
  description: [
    {
      type: "editor",
      name: "description",
      message: `Please write a short description for your project.
(Enter at least 1 line of 80 characters)`,
      validate: inquirerValidate,
      waitUserInput: true,
    },
  ],
  installation: [
    {
      type: "editor",
      name: "installation",
      message: "Please write the installation instructions of your project.",
      validate: inquirerValidate,
      waitUserInput: true,
    },
  ],
  usage: [
    {
      type: "editor",
      name: "usage",
      message: "Please provide information on how to use your project.",
      validate: inquirerValidate,
      waitUserInput: true,
    },
  ],
  license: [
    {
      type: "rawlist",
      name: "license",
      message: `
      What license do you want to choose for your project?
      (Please see https://choosealicense.com/licenses/ for further info)
      `,
      choices: licensesChoices,
    },
  ],
  contributing: [
    {
      type: "editor",
      name: "contributing",
      message:
        "Please provide information on how you contributed to your project.",
      validate: inquirerValidate,
      waitUserInput: true,
    },
  ],
  tests: [
    {
      type: "editor",
      name: "tests",
      message: "Please provide details on how to run tests in your project.",
      validate: inquirerValidate,
      waitUserInput: true,
    },
  ],
  questions: [
    {
      type: "editor",
      name: "questions",
      message: "Please include FAQs for your project.",
      validate: inquirerValidate,
      waitUserInput: true,
    },
  ],
};

/**
 * Inquirer validator for input text.
 *
 *  It validates that the text is at least 1 line of 80 characters.
 *
 * @param {string} intput
 *    The user input.
 * @returns {string|boolean}
 *    The validation result.
 */
function inquirerValidate(input) {
  if (input.lenght < 80 || input.split("\n").length < 1) {
    return "This section must be at least 1 line of 80 characters.";
  }
  return true;
}

/**
 * Asks for the README sections recursively.
 *
 * @param {[Object]} questions
 *    A list of questions.
 * @returns {Promise}
 *    The inquirer object.
 */
function askSections(questions) {
  return inquirer
    .prompt(questions)
    .then((answers) => {
      const { sections: section } = answers;

      if (section === "next") {
        return { sections: [] };
      }

      const questionsFiltered = questions;
      questionsFiltered[0].choices = questions[0].choices.filter(
        (choice) => choice !== section
      );

      return askSections(questionsFiltered).then((answers) => {
        return { sections: [section, ...answers.sections] };
      });
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        throw new Error(
          "Prompt couldn't be rendered in the current environment."
        );
      } else {
        // Something else went wrong
        console.error(error);
      }
    });
}

/**
 * Writes the README and parsed HTML files
 * to a compressed file.
 *
 * @param {string} fileName
 *    The filename.
 * @param {Array} data
 *    The files to compress.
 * @return {boolean|Error}
 *    The flag of the file generation result.
 */
async function writeToFile(fileName, data) {
  const timestamp = Date.now();
  const folderPath = path.resolve("./.downloads/");
  const compressFilePath = `${folderPath}/${timestamp}-${fileName}.zip`;
  const output = fsSync.createWriteStream(compressFilePath);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  // Event handlers.
  output.on("close", function () {
    console.log(`${archive.pointer()} total bytes`);
  });
  output.on("end", function () {
    console.log("Data has been drained");
  });
  archive.on("error", (err) => {
    throw err;
  });
  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      console.warn(err);
    } else {
      throw err;
    }
  });

  // write data to output file.
  archive.pipe(output);

  // append files.
  const [mdFilePath, htmlFilePath] = data;
  archive.append(fsSync.createReadStream(mdFilePath), { name: `README.md` });
  archive.append(fsSync.createReadStream(htmlFilePath), {
    name: `README.html`,
  });

  await archive.finalize();

  return compressFilePath;
}

/**
 * function to initialize program
 */
async function init() {
  try {
    const { sections } = await askSections(sectionsQuestions);

    if (!sections.length) {
      throw new Error("No sections for the README.");
    }

    let readme = {};
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];

      // ToC does not require questions,
      // only marked that need to be generated.
      if (section === "toc") {
        readme[section] = true;
        continue;
      }

      const answers = await inquirer.prompt(readmeQuestions[section]);
      readme = { ...readme, ...answers };
    }

    const [mdFilePath, htmlFilePath] = await generateMarkdown(readme);
    const compressFilePath = await writeToFile("README", [
      mdFilePath,
      htmlFilePath,
    ]);

    console.log(
      `Thanks for using our tool!. Your README is ready at "${compressFilePath}"`
    );
    generated = true;
  } catch (error) {
    console.error(error);
    generated = false;
  } finally {
    if (!generated) {
      const answer = await inquirer.prompt([
        {
          type: "confirm",
          name: "tryAgain",
          message: "Do you want to give another try?",
          default: false,
        },
      ]);

      if (answer.tryAgain) {
        init();
      }
    }
  }
}

///
// Main
///

// Set system settings.
const settings = {
  generator: {
    readmeFilename: "README",
    templatesFolder: path.resolve("./templates/partials/"),
  },
  parser: {
    html: true, // Enable HTML tags in source
    xhtmlOut: false, // Use '/' to close single tags (<br />)
    breaks: true, // Convert '\n' in paragraphs into <br>
    langPrefix: "language-", // CSS language prefix for fenced blocks

    // Enable some language-neutral replacement + quotes beautification
    typographer: true,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
    quotes: "“”‘’",
  },
  licences: licensesChoices,
};
setSettings(settings);

// function call to initialize program
init();
