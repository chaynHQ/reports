/**
 * General app health checks.
 *
 * These tests verify the structural, accessibility, and i18n foundations that
 * every production page must have — regardless of content. They should remain
 * green throughout all phases of the build.
 */
describe('App health', () => {
  it('home page responds with HTTP 200', () => {
    cy.request('/').its('status').should('eq', 200)
  })

  it('sets a lang attribute on the html element', () => {
    cy.visit('/')
    cy.get('html').should('have.attr', 'lang', 'en')
  })

  it('sets a dir attribute on the html element', () => {
    cy.visit('/')
    cy.get('html').should('have.attr', 'dir', 'ltr')
  })

  it('has a non-empty meta description', () => {
    cy.visit('/')
    cy.get('head meta[name="description"]')
      .should('have.attr', 'content')
      .and('not.be.empty')
  })

  it('has a main landmark', () => {
    cy.visit('/')
    cy.get('main').should('exist').and('be.visible')
  })

  it('/hi locale loads and sets lang="hi"', () => {
    cy.visit('/hi')
    cy.get('html').should('have.attr', 'lang', 'hi')
    cy.get('h1').should('contain.text', 'Swagat')
  })
})
