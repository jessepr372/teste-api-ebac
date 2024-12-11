/// <reference types="cypress" />

describe('Login', () => {
    let token;
  
    before(() => {
      cy.request({
        method: 'POST',
        url: 'login', // Ajuste conforme a URL da sua API
        body: {
          email: "fulano@qa.com", // Substitua pelo email de um usuário válido
          password: "teste" // Substitua pela senha válida
        }
      }).then((response) => {
        token = response.body.authorization; // Armazenando o token
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
  
    // Podemos exportar o token para ser utilizado nos outros testes
    after(() => {
      // Exporta o token globalmente
      Cypress.env('auth_token', token);
    });
  });
  