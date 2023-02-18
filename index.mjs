import fs from "fs/promises";
import path from "path";
import inquirer from "inquirer";
import generateMarkdown from "./utils/generateMarkdown.mjs";

/**
 * @type {Array[string]}
 *    The sections available to choose for the README.
 */
const sectionsChoices = [
  "title",
  "description",
  "installation",
  "usage",
  "license",
  "contributing",
  "tests",
  "questions",
];

/**
 * @type {[Object]}
 *    The sections question.
 */
const sectionsQuestions = [
  {
    name: "sections",
    type: "list",
    message: "Choose a section or select [Next] to continue:",
    choices: [...sectionsChoices, "Next"],
    default: "Done",
    transformer(input, answers, flags) {
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
          return "The title should be at least 3 characters long.";
        }

        return true;
      },
    },
    {
      type: "input",
      name: "description",
      message:
        "Please write a short description for your project of at least 1 line of 80 characters.",
      validate(text) {
        if (text.lenght < 80 || text.split("\n").length < 1) {
          return "The description must be at least 1 line of 80 characters.";
        }

        return true;
      },
      waitUserInput: true,
    },
  ],
  installation: [
    {
      type: "editor",
      name: "installation",
      message: "Please write the installation instructions of your project.",
      validate(text) {
        if (text.lenght < 80 || text.split("\n").length < 1) {
          return "The installation must be at least 1 line of 80 characters.";
        }

        return true;
      },
      waitUserInput: true,
    },
  ],
  usage: [
    {
      type: "editor",
      name: "usage",
      message: "Please provide information on how to use your project.",
      validate(text) {
        if (text.lenght < 80 || text.split("\n").length < 1) {
          return "The usage must be at least 1 line of 80 characters.";
        }

        return true;
      },
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
      choices: [
        "Apache License 2.0",
        "Boost Software License 1.0",
        "GNU AGPLv3",
        "GNU GPLv3",
        "GNU LGPLv3",
        "Mozilla Public License 2.0",
        "MIT License",
        "The Unlicense",
      ],
    },
  ],
  contributing: [
    {
      type: "editor",
      name: "contributing",
      message:
        "Please provide information on how you contributed to your project.",
      validate(text) {
        if (text.lenght < 80 || text.split("\n").length < 1) {
          return "The usage must be at least 1 line of 80 characters.";
        }

        return true;
      },
      waitUserInput: true,
    },
  ],
  tests: [
    {
      type: "editor",
      name: "tests",
      message: "Please provide details on how to run tests in your project.",
      validate(text) {
        if (text.lenght < 80 || text.split("\n").length < 1) {
          return "The usage must be at least 1 line of 80 characters.";
        }

        return true;
      },
      waitUserInput: true,
    },
  ],
  questions: [
    {
      type: "editor",
      name: "questions",
      message: "Please include FAQs for your project.",
      validate(text) {
        if (text.lenght < 80 || text.split("\n").length < 1) {
          return "The usage must be at least 1 line of 80 characters.";
        }

        return true;
      },
      waitUserInput: true,
    },
  ],
};

/**
 * @type {Array}
 *    The questions for the user.
 */
let questions = [];

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

      if (section === "Next" || section === "Done") {
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
        throw Error("Prompt couldn't be rendered in the current environment.");
      } else {
        // Something else went wrong
        console.error(error);
      }
    });
}

// function to initialize program
async function init() {
  try {
    const { sections: sectionsAnswers } = await askSections(sectionsQuestions);

    let readmeAnswers = {};

    for (let i = 0; i < sectionsAnswers.length; i++) {
      const section = sectionsAnswers[i];

      const answers = await inquirer.prompt(readmeQuestions[section]);
      readmeAnswers[section] = answers[section];
    }

    console.log(readmeAnswers);
  } catch (error) {
    console.error(error);
  }
}

// function call to initialize program
init();
