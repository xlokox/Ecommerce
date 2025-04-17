describe('Payment Flow', () => {
  beforeEach(() => {
    cy.login() // Custom command for login
  })

  it('completes payment process successfully', () => {
    cy.visit('/checkout')
    cy.get('[data-testid="payment-form"]').should('be.visible')
    cy.fillStripeElements() // Custom command for Stripe
    cy.get('[data-testid="submit-payment"]').click()
    cy.get('[data-testid="success-message"]').should('be.visible')
  })
})