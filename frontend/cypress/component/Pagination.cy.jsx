/* global cy */
import React from 'react';
import Pagination from '../../src/components/Pagination';

describe('Pagination Component Tests', () => {
  const mountComponent = (pageNumber, totalItem = 100, parPage = 10, showItem = 5) => {
    const setPageNumber = cy.spy().as('setPageNumber');

    cy.mount(
      <Pagination
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        totalItem={totalItem}
        parPage={parPage}
        showItem={showItem}
      />
    );
  };

  it('renders correct number of buttons and arrows', () => {
    mountComponent(3);

    cy.get('ul > li').should('have.length', 7); // 5 pages + 2 arrows
  });

  it('highlights active page correctly', () => {
    mountComponent(3);

    cy.get('ul > li').filter(':contains("3")')
      .should('have.class', 'bg-green-700')
      .and('have.class', 'text-white');
  });

  it('calls setPageNumber when page button clicked', () => {
    mountComponent(3);

    cy.get('ul > li').filter(':contains("4")').click();
    cy.get('@setPageNumber').should('have.been.calledWith', 4);
  });

  it('handles previous arrow click correctly', () => {
    mountComponent(3);

    cy.get('ul > li').first().click();
    cy.get('@setPageNumber').should('have.been.calledWith', 2);
  });

  it('handles next arrow click correctly', () => {
    mountComponent(3);

    cy.get('ul > li').last().click();
    cy.get('@setPageNumber').should('have.been.calledWith', 4);
  });

  it('does not render previous arrow on first page', () => {
    mountComponent(1);

    cy.get('ul > li').first().should('contain', '1');
    cy.get('ul > li').should('have.length', 6); // 5 pages + next arrow
  });

  it('does not render next arrow on last page', () => {
    mountComponent(10);
  
    // מוודא שהכפתור האחרון הוא לא החץ הבא אלא מספר עמוד
    cy.get('ul > li').last().should('not.contain', 'svg');
  
    // מוודא שהעמוד האחרון שמוצג הוא 10 או נמוך ממנו בהתאם ללוגיקה שלך
    cy.get('ul > li').contains('10').should('not.exist');
  
    // לוודא שהמספר 9 כן מוצג (העמוד הקודם)
    cy.get('ul > li').filter(':contains("9")').should('exist');
  });  
});
