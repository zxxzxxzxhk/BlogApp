/* eslint-disable no-undef */
describe('Blog app', function () {
  beforeEach(function () {
    cy.visit('http://localhost:3001')
  })

  describe('Login', function () {
    it('Login form is shown', function () {
      cy.contains('Log in').click()
      cy.contains('Username')
      cy.contains('Password')
      cy.contains('Login')
    })
    it('succeeds with correct credentials', function () {
      cy.contains('Log in').click()
      cy.contains('Username')
      cy.contains('Password')
      cy.contains('Login')
      cy.get('#username').type('abc123')
      cy.get('#password').type('abc123')
      cy.get('#login-button').click()
      cy.contains('abc123 logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('Log in').click()
      cy.contains('Username')
      cy.contains('Password')
      cy.contains('Login')
      cy.get('#username').type('abc123')
      cy.get('#password').type('123')
      cy.get('#login-button').click()
      cy.contains('Wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.contains('Log in').click()
      cy.contains('Username')
      cy.contains('Password')
      cy.contains('Login')
      cy.get('#username').type('abc123')
      cy.get('#password').type('abc123')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function () {
      cy.contains('Add New Blog').click()
      cy.get('.title').type('test')
      cy.get('.author').type('test')
      cy.get('.url').type('test')
      cy.get('#create').click()
      cy.get('.blogTitle').contains('Title : test Author : test')
    })

    it('A blog can be liked', function () {
      cy.contains('Title : test Author : test')
        .find('#view')
        .click()
        .get('#like')
        .click({ force: true })
      cy.contains('Likes : 1')
    })

    it('A blog can be deleted', function () {
      cy.contains('Title : test Author : test')
        .find('#view')
        .click()
        .get('#remove')
        .click({ force: true })
      cy.get('.new').contains('test is successfully removed')
    })
  })
})
