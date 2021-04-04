describe('React App Component tests', () => {
   it('Visit sign-in page', () => {
      cy.visit('/')
   })
   
   it('Find Sign In button', () => {
      cy.visit('/')
      cy.contains('Sign In')
   })

   it('Find Register button', () => {
      cy.visit('/')
      cy.contains('Register')
   })

   it('Find name field when Register is pressed', () => {
      cy.visit('/')
      cy.contains('Register').click()
      cy.contains('Name')
      cy.get('input[name="name"]')
         .type('My Name')
         .should('have.value', "My Name")
      cy.get('input[name="email"]')
         .type("kenneth@kefo.no")
      cy.get('input[name="password"]')
         .type("password")
   })

})

describe('Sign In and Sign Out Tests', () => {
   it('Register an account', () => {
      cy.visit('/')
      cy.contains('Register').click()
      cy.contains('Name')
      cy.get('input[name="name"]')
         .type('My Name')
         .should('have.value', "My Name")
      cy.get('input[name="email"]')
         .type("kenneth@kefo.no")
      cy.get('input[name="password"]')
         .type("password")
      cy.get('button[type="submit"]').click()
      cy.contains("Sign In")
   })

   it('Sign in with an account', () => {
      cy.visit('/')
      cy.get('input[name="email"]')
         .type("kenneth@kefo.no")
      cy.get('input[name="password"]')
         .type("password")
      cy.get('button[type="submit"]').click()
      cy.contains('Logged in')
   })

   it('Sign in with an account and logout', () => {
      cy.visit('/')
      cy.get('input[name="email"]')
         .type("kenneth@kefo.no")
      cy.get('input[name="password"]')
         .type("password")
      cy.get('button[type="submit"]').click()
      cy.contains('Logged in')
      cy.get('button[type="submit"]').click()
      cy.contains('Sign In')
   })
})
