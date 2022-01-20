describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'testi',
      name: 'Testi käyttis',
      password: '12345www6789'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Login to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testi')
      cy.get('#password').type('12345www6789')
      cy.get('#login').click()
      cy.contains('testi logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testi')
      cy.get('#password').type('e')
      cy.get('#login').click()
      cy.get('.error').contains('wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('testi')
      cy.get('#password').type('12345www6789')
      cy.get('#login').click()
      cy.contains('create new blog').click()
    })

    it('A blog can be created', function() {
      cy.get('#title').type('otsikko')
      cy.get('#author').type('tekijä')
      cy.get('#url').type('urli')
      cy.get('#create_button').click()
      cy.contains('otsikko tekijä')
    })
  })

  describe('Blog manipulation', function() {
    beforeEach(function() {
      cy.get('#username').type('testi')
      cy.get('#password').type('12345www6789')
      cy.get('#login').click()
      cy.contains('create new blog').click()
      cy.get('#title').type('eka')
      cy.get('#author').type('tekijä')
      cy.get('#url').type('urli')
      cy.get('#create_button').click()
    })

    it('A blog can be liked', function() {
      cy.contains('view').click()
      cy.get('#like').click()
      cy.get('.success').contains('Liked')
    })

    it('A blog can be deleted', function() {
      cy.contains('view').click()
      cy.get('#like').click()
      cy.get('#delete').click()
      cy.get('.success').contains('Deleted')
    })

    it('Blogs are sorted by likes', function() {
      cy.get('#title').type('toka')
      cy.get('#author').type('tekijä')
      cy.get('#url').type('toka')
      cy.get('#create_button').click()

      cy.get('#title').type('vika')
      cy.get('#author').type('tekijä')
      cy.get('#url').type('vika')
      cy.get('#create_button').click()

      cy.visit('http://localhost:3000')

      cy.contains('view').click()
      cy.get('#like').click()
      cy.wait(500)
      cy.get('#like').click()

      cy.contains('view').click()
      cy.contains('toka').parent().contains('like').click()

      cy.get('div:contains("tekijä")').then(blogs => {
        console.log(blogs[4])
        console.log(blogs[6])
        console.log(blogs[8])
        expect(blogs[4]).to.contain.text('eka')
        expect(blogs[6]).to.contain.text('toka')
        expect(blogs[8]).to.contain.text('vika')
      })
    })
  })
})