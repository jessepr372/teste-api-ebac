/// <reference types="cypress" />

describe('Login', () => {
    let token;
  
    before(() => {
      cy.request({
        method: 'POST',
        url: 'login', 
        body: {
          email: "fulano@qa.com", 
          password: "teste" 
        }
      }).then((response) => {
        token = response.body.authorization;
      });
    });
  
    it('Deve fazer login com sucesso', () => {
      cy.request({
        method: 'POST',
        url: 'login',
        body: {
          "email": "fulano@qa.com",
          "password": "teste"
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Login realizado com sucesso');
        cy.log(response.body.authorization);
      });
    });
  
  
    after(() => {
     
      Cypress.env('auth_token', token);
    });
  });
  