/* global cy */
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Header from '../../src/components/Header';
import authReducer from '../../src/store/reducers/authReducer';
import homeReducer from '../../src/store/reducers/homeReducer';
import cardReducer from '../../src/store/reducers/cardReducer';

// Mock store for testing
const createMockStore = (userInfo = null) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      home: homeReducer,
      card: cardReducer
    },
    preloadedState: {
      auth: {
        userInfo
      },
      home: {
        categorys: [
          { _id: '1', name: 'Electronics' },
          { _id: '2', name: 'Clothing' }
        ]
      },
      card: {
        card_product_count: 2,
        wishlist_count: 1
      }
    }
  });
};

describe('Header Component', () => {
  beforeEach(() => {
    // Mock localStorage
    cy.window().then((win) => {
      win.localStorage.clear();
      win.localStorage.getItem = cy.stub().returns(null);
    });
  });

  it('renders correctly when user is not logged in', () => {
    const store = createMockStore();
    
    cy.mount(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    // Check if the header elements are rendered correctly
    cy.get('header').should('exist');
    cy.contains('Login').should('exist');
  });

  it('renders correctly when user is logged in', () => {
    const store = createMockStore({ 
      id: '123', 
      name: 'John Doe',
      email: 'john@example.com' 
    });
    
    cy.mount(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    // Check if user-specific elements are rendered
    cy.contains('John Doe').should('exist');
  });

  it('displays categories correctly', () => {
    const store = createMockStore();
    
    cy.mount(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    // Check if categories are rendered
    cy.contains('Electronics').should('exist');
    cy.contains('Clothing').should('exist');
  });

  it('has a functional search input', () => {
    const store = createMockStore();
    
    cy.mount(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    // Check if search input exists and can be typed in
    cy.get('input[type="text"]').first()
      .type('test search')
      .should('have.value', 'test search');
  });

  it('shows cart and wishlist counts', () => {
    const store = createMockStore({ 
      id: '123', 
      name: 'John Doe',
      email: 'john@example.com' 
    });
    
    cy.mount(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    // Check if cart and wishlist counts are displayed
    cy.contains('2').should('exist'); // Cart count
    cy.contains('1').should('exist'); // Wishlist count
  });
});
