/// <reference types="cypress" />

const { faker } = require('@faker-js/faker');

describe('Testes da Funcionalidade Usuários', () => {

  let token;
  const baseUrl = '/usuarios';

  before(() => {
    token = Cypress.env('auth_token');
  });

  const requestApi = (method, url, body = null, failOnStatusCode = true) => {
    return cy.request({
      method,
      url,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body,
      failOnStatusCode
    });
  };

  it('Deve validar contrato de usuários', () => {
    requestApi('GET', baseUrl).then((response) => {
      expect(response.status).to.equal(200);
      const usuarios = response.body.usuarios;
      expect(usuarios).to.be.an('array');
      expect(usuarios[0]).to.have.all.keys('_id', 'nome', 'email', 'password', 'administrador');
      expect(usuarios[0]._id).to.be.a('string');
      expect(usuarios[0].nome).to.be.a('string');
      expect(usuarios[0].email).to.be.a('string');
      expect(usuarios[0].password).to.be.a('string');
      expect(usuarios[0].administrador).to.be.a('string');
    });
  });

  it('Deve listar usuários cadastrados', () => {
    requestApi('GET', baseUrl).then((response) => {
      expect(response.status).to.equal(200);
      const usuarios = response.body.usuarios;
      expect(usuarios).to.be.an('array');
      expect(usuarios.length).to.be.greaterThan(0);
      expect(usuarios[0]).to.have.all.keys('_id', 'nome', 'email', 'password', 'administrador');
    });
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    const uniqueEmail = `novoUsuario_${Date.now()}@qa.com`;

    requestApi('POST', baseUrl, {
      nome: "Novo Usuário",
      email: uniqueEmail,
      password: "senha123",
      administrador: "false"
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal('Cadastro realizado com sucesso');
      expect(response.body).to.have.property('_id');
    });
  });

  it('Deve validar um usuário com email duplicado', () => {
 
    const emailDuplicado = faker.internet.email();

 
    requestApi('POST', baseUrl, {
      nome: faker.person.fullName(),
      email: emailDuplicado,
      password: faker.internet.password(),
      administrador: 'false'
    }).then((response) => {
      expect(response.status).to.equal(201);
    });


    requestApi('POST', baseUrl, {
      nome: faker.person.fullName(),
      email: emailDuplicado,
      password: faker.internet.password(),
      administrador: 'false'
    }, false).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Este email já está sendo usado');
    });
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    const usuarioId = '0uxuPY0cbmQhpEz1'; 
    const novoNome = 'Usuário Editado';
    const novoEmail = 'usuarioeditar2@teste.com';

    requestApi('PUT', `${baseUrl}/${usuarioId}`, {
      nome: novoNome,
      email: novoEmail,
      password: "senha123",
      administrador: "false"
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Registro alterado com sucesso');
    });

    requestApi('GET', `${baseUrl}/${usuarioId}`).then((response) => {
      expect(response.body.nome).to.equal(novoNome);
      expect(response.body.email).to.equal(novoEmail);
    });
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    const novoUsuario = {
      nome: 'Novo Usuário',
      email: 'novousuario@teste.com',
      password: 'senha123',
      administrador: 'false'
    };

    requestApi('POST', baseUrl, novoUsuario).then((response) => {
      const usuarioId = response.body._id;

      requestApi('DELETE', `${baseUrl}/${usuarioId}`).then((deleteResponse) => {
        expect(deleteResponse.status).to.equal(200);
        expect(deleteResponse.body.message).to.equal('Registro excluído com sucesso');
      });
    });
  });

});
