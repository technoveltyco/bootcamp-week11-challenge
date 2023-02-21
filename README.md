# Working with ES6 & Node.js: Professional README Generator

README Generator is a command-line application that dynamically generates a professional README.md file from a user's input using the Inquirer package.

<!-- project repository shields -->
<p align="center">
  <img src="https://img.shields.io/github/repo-size/technoveltyco/bootcamp-week11-challenge" />
  <img src="https://img.shields.io/github/languages/top/technoveltyco/bootcamp-week11-challenge" />
  <img src="https://img.shields.io/github/issues/technoveltyco/bootcamp-week11-challenge" />
  <img src="https://img.shields.io/github/last-commit/technoveltyco/bootcamp-week11-challenge" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-orange" />
  <img src="https://img.shields.io/badge/CSS3-blue" />
  <img src="https://img.shields.io/badge/SaSS-purple" />
  <img src="https://img.shields.io/badge/Javascript-yellow" />
  <img src="https://img.shields.io/badge/Node.js-green" />
  <img src="https://img.shields.io/badge/Inquirer-red" />
    <img src="https://img.shields.io/badge/Remarkable-gray" />
</p>
<!-- end project repository shields -->

## Table of contents

- [Working with ES6 \& Node.js: Professional README Generator](#working-with-es6--nodejs-professional-readme-generator)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
    - [The challenge](#the-challenge)
    - [Screenshot](#screenshot)
    - [Links](#links)
  - [My process](#my-process)
    - [Built with](#built-with)
    - [What I learned](#what-i-learned)
    - [Continued development](#continued-development)
    - [Useful resources](#useful-resources)
  - [Author](#author)
  - [Acknowledgments](#acknowledgments)

## Overview

When creating an open source project on GitHub, it’s important to have a high-quality README for the app. This should include what the app is for, how to use the app, how to install it, how to report issues, and how to make contributions—this last part increases the likelihood that other developers will contribute to the success of the project.

You can quickly and easily create a README file by using a command-line application to generate one. This allows the project creator to devote more time to working on the project.

### The challenge

Your task is to create a command-line application that dynamically generates a professional README.md file from a user's input using the [Inquirer package](https://www.npmjs.com/package/inquirer). Review the [Good README Guide](../../01-HTML-Git-CSS/04-Important/Good-README-Guide/README.md) as a reminder of everything that a high-quality, professional README should contain.

The application will be invoked by using the following command:

```bash
node index.mjs
```

### Screenshot

**Landing page with links to the resources**

[![Landing page](./docs/assets/img/Screenshot%202023-02-21%20at%2013-28-36%20Landing%20page%20README%20Generator.png)](https://technoveltyco.github.io/bootcamp-week11-challenge/)

**Walkthrough video**

<video src="./docs/assets/media/walkthrough-readme-generator.mp4" controls style="max-width: 750px">
  README Generator walkthrough video.
</video>

### Links

- Solution URL: [https://github.com/technoveltyco/bootcamp-week11-challenge](https://github.com/technoveltyco/bootcamp-week11-challenge)
- Live Site URL: [https://technoveltyco.github.io/bootcamp-week11-challenge/](https://technoveltyco.github.io/bootcamp-week11-challenge/)

## My process

**Landing Page**

The chosen [Color Pallete](https://www.colorhunt.co/palette/000000282a3a735f32c69749) for theming the landing page, and future web pages like the Editor page with the remote terminal.

A documentation page with the generated color pallete for the implemented theme can be seen at [README Generator Docs](https://technoveltyco.github.io/bootcamp-week11-challenge/docs/).

**Walkthrough Video**

You can see an example on how to use the application in your local machine lookig at the video on the [landing page](https://technoveltyco.github.io/bootcamp-week11-challenge/). 

### Built with

- Node.js
- Inquirer
- Remarkable
- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- SaSS
- BEM CSS Methodology
- Mobile first design

### What I learned

**Generate shade from a color pallete in CSS**

```css
:root {
  /**
   * color scheme
   * in HSL, only one value changes
   * in RGB this is more complex.
   */
  --color-1: hsl(0, 0%, 0%); /* rgb(0, 0, 0); */
  --color-2: hsl(233, 18%, 19%); /* rgb(40, 42, 58); */
  --color-3: hsl(42, 39%, 32%); /* rgb(115, 95, 50); */
  --color-4: hsl(37, 52%, 53%); /* rgb(198, 151, 73); */
}

/* color shades variants */
[data-theme=color-1] {
  --shade-1: hsl(0, 0%, 10%);
  --shade-2: hsl(0, 0%, 15%);
  --shade-3: hsl(0, 0%, 20%);
  --shade-4: hsl(0, 0%, 25%);
  --shade-5: hsl(0, 0%, 30%);
  --shade-6: hsl(0, 0%, 35%);
}

[data-theme=color-2] {
  --shade-1: hsl(233, 18%, 24%);
  --shade-2: hsl(233, 18%, 29%);
  --shade-3: hsl(233, 18%, 34%);
  --shade-4: hsl(233, 18%, 39%);
  --shade-5: hsl(233, 18%, 44%);
  --shade-6: hsl(233, 18%, 49%);
}

[data-theme=color-3] {
  --shade-1: hsl(42, 39%, 37%);
  --shade-2: hsl(42, 39%, 42%);
  --shade-3: hsl(42, 39%, 47%);
  --shade-4: hsl(42, 39%, 52%);
  --shade-5: hsl(42, 39%, 57%);
  --shade-6: hsl(42, 39%, 62%);
}

[data-theme=color-4] {
  --shade-1: hsl(37, 52%, 58%);
  --shade-2: hsl(37, 52%, 63%);
  --shade-3: hsl(37, 52%, 68%);
  --shade-4: hsl(37, 52%, 73%);
  --shade-5: hsl(37, 52%, 78%);
  --shade-6: hsl(37, 52%, 83%);
}
```

**Use recursion to ask multiple times with Enquiry**

```js
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
```

**Compressing in Node.js**

```js
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
```

### Continued development

The following features are created for future development:

- Landing Page
- Online Editor Page
- Remote Terminal

### Useful resources

- Markdown / HTML
  - [The easiest way to create a README](https://readme.so/editor)
  - [Awesome README](https://github.com/matiassingers/awesome-readme)
  - [Auto-generating Markdown tables of contents](https://alexharv074.github.io/2018/08/28/auto-generating-markdown-tables-of-contents.html)
  - [<video>: The Video Embed element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- CSS & UX/UI
  - [MDN - Organizing your CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Organizing)
  - [MDN - Using media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)
  - [A Look at Some CSS Methodologies](https://www.webfx.com/blog/web-design/css-methodologies/)
  - [Which CSS method should I use?](https://medium.com/@lizziebailey/which-css-method-should-i-use-b3b87f47081e)
  - [How to Choose the Best CSS Framework: Understanding Metrics and Context](https://prismic.io/blog/how-to-choose-the-best-css-framework)
  - [Understanding CSS Writing Methodologies](https://www.hongkiat.com/blog/css-writing-methodologies/)
  - [CSS Naming Conventions that Will Save You Hours of Debugging](https://www.freecodecamp.org/news/css-naming-conventions-that-will-save-you-hours-of-debugging-35cea737d849/)
  - [BEM Methodology In CSS: A Quick Start Guide](https://scalablecss.com/bem-quickstart-guide/#1391467)
  - [BEM vs. SMACSS: Comparing CSS methodologies](https://blog.logrocket.com/bem-vs-smacss-comparing-css-methodologies/)
  - [What makes BEM better than using a nestable style sheet language like LESS?](https://softwareengineering.stackexchange.com/questions/279190/what-makes-bem-better-than-using-a-nestable-style-sheet-language-like-less)
  - [BEM CSS Methodology](https://en.bem.info/)
  - [Atomic Design](https://atomicdesign.bradfrost.com/table-of-contents/)
  - [Atomizer](https://acss.io/)
  - [Systematic CSS](https://www.yumpu.com/en/document/read/47573458/systematic-css)
  - [50 CSS Best Practices & Guidelines to Write Better CSS](https://medium.com/before-semicolon/50-css-best-practices-guidelines-to-write-better-css-c60807e9eee2)
  - [The New CSS Reset](https://elad2412.github.io/the-new-css-reset/)
  - [CSS Unit Guide: CSS em, rem, vh, vw, and more, Explained](https://www.freecodecamp.org/news/css-unit-guide/)
  - [Generating Shades of Color Using CSS Variables](https://blog.jim-nielsen.com/2019/generating-shades-of-color-using-css-variables/)
  - [Creating Color Themes With Custom Properties, HSL, and a Little calc()](https://css-tricks.com/creating-color-themes-with-custom-properties-hsl-and-a-little-calc/)
  - [Color Hunt](https://www.colorhunt.co/palette/000000282a3a735f32c69749)
  - [122 Shades of White Color With Names, Hex, RGB, CMYK Codes](https://www.color-meanings.com/shades-of-white-color-names-html-hex-rgb-codes/)
  - [Complementary Color Picker](https://giggster.com/guide/complementary-colors/)
  - [Color wheel](https://www.canva.com/colors/color-wheel/)
  - [Color Palletes Generator](https://coolors.co/)
  - [The Best Way to Implement a “Wrapper” in CSS](https://css-tricks.com/best-way-implement-wrapper-css/)
  - [Styling Layout Wrappers In CSS](https://ishadeed.com/article/styling-wrappers-css/)
  - [A Complete Introduction to Web Components in 2023](https://kinsta.com/blog/web-components/#a-brief-history-of-web-components)
  - [An Introduction to Web Components](https://css-tricks.com/an-introduction-to-web-components/)
  - [Landing Page Vs. Homepage: What’s The Difference?](https://lineardesign.com/blog/landing-page-vs-homepage/)
  - [How To Design an Effective Landing Page — 8 Best Practices](https://elementor.com/blog/how-to-design-effective-landing-page/)
  - [The Anatomy of a Landing Page](https://unbounce.com/landing-page-articles/the-anatomy-of-a-landing-page/)
  - [The Component Gallery](https://component.gallery/)
  - [WebComponents.org](https://www.webcomponents.org/)
  - [GitHub - MDN - Web Component examples](https://github.com/mdn/web-components-examples)
  - [GitHub - Awesome Standalones Web Components](https://github.com/davatron5000/awesome-standalones)
  - [GitHub - Accessible Components](https://github.com/scottaohara/accessible_components)
- JavaScript / Node.js / TypeScript
  - [Using Import aliases in JavaScript](https://medium.com/dailyjs/using-import-aliases-in-javascript-a0b46237601c)
  - [Inquirer](https://www.npmjs.com/package/inquirer)
  - [Remarkable](https://www.npmjs.com/package/remarkable)
  - [MarkdownTOC - Generate a markdown TOC (table of contents) with Remarkable](https://www.npmjs.com/package/markdown-toc)
  - [CommonJS vs. ES modules in Node.js](https://blog.logrocket.com/commonjs-vs-es-modules-node-js/)
  - [How to Deploy Your Node.js Application for Free with Render](https://www.freecodecamp.org/news/how-to-deploy-nodejs-application-with-render/)
  - [Zipping and unzipping files with NodeJS](https://medium.com/@harrietty/zipping-and-unzipping-files-with-nodejs-375d2750c5e4)
  - [Zipping a file(or multiple files ) in Nodejs](https://medium.com/@eralderald/zipping-a-file-or-multiple-files-in-nodejs-f8c41c7a959d)
  - [Gzip compression with Node.js](https://medium.com/@victor.valencia.rico/gzip-compression-with-node-js-cc3ed74196f9)
  - [How to Check if a File exists in Node using Async/Await](https://sabe.io/blog/node-check-file-exists-async-await)
  - [What is a “.d.ts” file in TypeScript?](https://medium.com/@ohansemmanuel/what-is-a-d-ts-file-in-typescript-2e2d90d58eca)
- Remote terminal / Security
  - [How to create web-based terminals](https://dev.to/saisandeepvaddi/how-to-create-web-based-terminals-38d)
  - [Xterm js Terminal](https://medium.com/yavar/xterm-js-terminal-2b19ccd2a52)
  - [Xterm js Security](https://xtermjs.org/docs/guides/security/)
  - [How to secure your WebSocket connections](https://www.freecodecamp.org/news/how-to-secure-your-websocket-connections-d0be0996c556/)
  - [Testing for WebSockets security vulnerabilities](https://portswigger.net/web-security/websockets)
  - [HTML5 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)

## Author

  Daniel Rodriguez
- GitHub - [Technovelty](https://github.com/technoveltyco)

## Acknowledgments

The teacher and TAs that help us with resources and support to my questions during the development of this project.
