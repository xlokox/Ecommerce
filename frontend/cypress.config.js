const { defineConfig } = require("cypress");

console.log("Loaded Cypress config!"); // 🔥 בדיקה האם הקובץ נטען בכלל

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
    indexHtmlFile: "cypress/support/component-index.html",
    specPattern: "cypress/**/*.cy.{js,jsx,ts,tsx}",
  },
});
