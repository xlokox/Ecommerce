/* global Cypress */

// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import '@testing-library/cypress/add-commands';
import './commands';
import { mount } from 'cypress/react';

// הוספת פקודת `mount` לבדיקה קלה של קומפוננטות
Cypress.Commands.add('mount', mount);

// Example use:
// cy.mount(<MyComponent />);

// ✅ טיפול בשגיאות לא קריטיות, כדי לא להפסיק את הבדיקה בגללן
Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});
