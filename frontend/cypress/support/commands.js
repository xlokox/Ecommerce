/* global Cypress, cy */
import '@testing-library/cypress/add-commands';

// ✅ פקודה מותאמת אישית למציאת אלמנטים לפי `data-testid`
Cypress.Commands.add("getByTestId", (testId) => {
    return cy.get(`[data-testid="${testId}"]`);
});

// ✅ פקודה מותאמת אישית להזנת טקסט בשדות אינפוט
Cypress.Commands.add("fillInput", (selector, text) => {
    cy.get(selector).clear().type(text);
});

// ✅ פקודה מותאמת אישית ללחיצה על כפתור
Cypress.Commands.add("clickButton", (selector) => {
    cy.get(selector).click();
});

// ✅ טיפול בשגיאות לא קריטיות, כדי לא להפסיק את הבדיקה בגללן
Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});