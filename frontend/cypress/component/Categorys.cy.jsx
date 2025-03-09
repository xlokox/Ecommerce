/* global cy */
// cypress/components/Categorys.cy.js
import React from 'react';
import Categorys from '../../src/components/Categorys';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

const mockCategorys = [
  { name: 'Electronics', image: 'electronics.jpg' },
  { name: 'Fashion', image: 'fashion.jpg' },
  { name: 'Toys', image: 'toys.jpg' }
];

const mockStore = configureStore({
  reducer: {
    home: () => ({ categorys: mockCategorys })
  }
});

describe('Categorys Component Tests', () => {
  const mountComponent = () => {
    cy.mount(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Categorys />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders category images correctly', () => {
    mountComponent();

    mockCategorys.forEach((category, index) => {
      cy.get(`[data-cy="category-link-${index}"] img`)
        .should('have.attr', 'src', category.image)
        .and('exist');
    });
  });

  it('renders correct category links', () => {
    mountComponent();

    mockCategorys.forEach((category, index) => {
      cy.get(`[data-cy="category-link-${index}"]`)
        .should('have.attr', 'href', `/products?category=${category.name}`);
    });
  });

  it('renders component title correctly', () => {
    mountComponent();

    cy.get('h2').contains('Top Category').should('exist');
  });
});

