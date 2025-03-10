/* global cy */
import React from 'react';
import Rating from '../../src/components/Rating';

describe('Rating Component Tests', () => {
  const mountComponent = (ratings) => {
    cy.mount(<Rating ratings={ratings} />);
  };

  it('renders five full stars correctly', () => {
    mountComponent(5);
    cy.get('span[class="text-[#EDBB0E]"]').should('have.length', 5);
    cy.get('span[class="text-[#EDBB0E]"] svg').should('have.length', 5);
  });

  it('renders half stars correctly', () => {
    mountComponent(3.5);
    cy.get('span[class="text-[#EDBB0E]"]').should('have.length', 4);
    cy.get('span[class="text-[#EDBB0E]"] svg').should('exist');
    cy.get('span[class="text-slate-600"]').should('have.length', 1);
  });

  it('renders empty stars correctly', () => {
    mountComponent(0);
    cy.get('span.text-slate-600').should('have.length', 5);
    cy.get('span[class="text-slate-600"] svg').should('exist');
  });

  it('renders mixed stars correctly', () => {
    mountComponent(2.5);
    cy.get('span[class="text-[#EDBB0E]"]').should('have.length', 3); // שני כוכבים מלאים ואחד חצי
    cy.get('span[class="text-slate-600"]').should('have.length', 2); // שני כוכבים ריקים
  });
});
