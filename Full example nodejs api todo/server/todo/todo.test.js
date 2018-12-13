const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai');

const { expect } = chai;
const app = require('../..');

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## Todo APIs', () => {
  let todo = {
    name: 'KK123',
  };

  const validUserCredentials = {
    username: 'testUserName22',
    password: '11aadeviceId',
  };

  const validUserCredentials2 = {
    username: 'SecondUser2',
    password: '11aadeviceId',
  };

  let jwtToken;
  let jwtToken2;

  describe('# POST /api/todos', () => {
    it('should create a new user', (done) => {
      request(app)
        .post('/api/users')
        .send(validUserCredentials)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(validUserCredentials.username);
          done();
        })
        .catch(done);
    });

    it('should get valid JWT token', (done) => {
      request(app)
        .post('/api/auth/login')
        .send(validUserCredentials)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('token');
          jwtToken = `Bearer ${res.body.token}`;
          done();
        })
        .catch(done);
    });

    it('should create a new todo', (done) => {
      request(app)
        .post('/api/todos')
        .set('Authorization', jwtToken)
        .send({
          ...todo,
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(todo.name);
          todo = res.body;
          done();
        })
        .catch(done);
    });

    it('should create a new user', (done) => {
      request(app)
        .post('/api/users')
        .send(validUserCredentials2)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(validUserCredentials2.username);
          done();
        })
        .catch(done);
    });

    it('should get valid JWT token', (done) => {
      request(app)
        .post('/api/auth/login')
        .send(validUserCredentials2)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('token');
          jwtToken2 = `Bearer ${res.body.token}`;
          done();
        })
        .catch(done);
    });

    it('should create a new todo', (done) => {
      request(app)
        .post('/api/todos')
        .set('Authorization', jwtToken2)
        .send({
          ...todo,
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(todo.name);
          todo = res.body;

          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/todos/:todoId', () => {
    it('should get todo details', (done) => {
      request(app)
        .get(`/api/todos/${todo.id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(todo.name);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when todo does not exists', (done) => {
      request(app)
        .get('/api/todos/56c787ccc67fc16ccc1a5e92')
        .set('Authorization', jwtToken)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/todos/:todoId', () => {
    it('should update todo details', (done) => {
      todo.name = 'KK';
      request(app)
        .put(`/api/todos/${todo.id}`)
        .set('Authorization', jwtToken)
        .send(todo)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal('KK');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/todos/', () => {
    it('should get all todos', (done) => {
      request(app)
        .get('/api/todos')
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(1);
          done();
        })
        .catch(done);
    });

    it('should create a new todo', (done) => {
      request(app)
        .post('/api/todos')
        .set('Authorization', jwtToken)
        .send({
          ...todo,
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(todo.name);
          todo = res.body;
          done();
        })
        .catch(done);
    });

    it('should get all todos', (done) => {
      request(app)
        .get('/api/todos')
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(2);
          done();
        })
        .catch(done);
    });

    it('should get all todos (with limit and skip)', (done) => {
      request(app)
        .get('/api/todos')
        .query({ limit: 10, skip: 1 })
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all todos of second user', (done) => {
      request(app)
        .get('/api/todos')
        .set('Authorization', jwtToken2)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(1);
          done();
        })
        .catch(done);
    });

    it('should add 1 todo from user1 to user2', (done) => {
      request(app)
        .post('/api/todos/add')
        .set('Authorization', jwtToken2)
        .send({
          shortId: todo.shortId,
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(todo.name);
          todo = res.body;
          done();
        })
        .catch(done);
    });

    it('should get all todos of second user', (done) => {
      request(app)
        .get('/api/todos')
        .set('Authorization', jwtToken2)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(2);
          expect(res.body[0].list.length).to.equal(0);
          expect(res.body[0].done).to.equal(0);
          expect(res.body[0].total).to.equal(0);
          done();
        })
        .catch(done);
    });
  });

  // describe('# DELETE /api/todos/', () => {
  //   it('should delete todo', (done) => {
  //     request(app)
  //       .delete(`/api/todos/${todo._id}`)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body.name).to.equal('KK');
  //         done();
  //       })
  //       .catch(done);
  //   });
  // });

  describe('# POST /api/todos/items', () => {
    let itemId = null;
    it('should add an item to a todo', (done) => {
      request(app)
        .post(`/api/todos/${todo.id}/items`)
        .send({ text: 'coucoulatodo' })
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.list).to.be.an('array');
          expect(res.body.list.length).to.equal(1);
          itemId = res.body.list[0].id;
          done();
        })
        .catch(done);
    });
    it('should modify an item in a todo', (done) => {
      request(app)
        .put(`/api/todos/${todo.id}/items/${itemId}`)
        .send({ text: 'coucoulatodo', status: 'DONE' })
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.list).to.be.an('array');
          expect(res.body.list.length).to.equal(1);
          expect(res.body.list[0].text).to.equal('coucoulatodo');
          expect(res.body.list[0].status).to.equal('DONE');
          done();
        })
        .catch(done);
    });
    it('should get todo details', (done) => {
      request(app)
        .get(`/api/todos/${todo.id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(todo.name);
          expect(res.body.list[0].text).to.equal('coucoulatodo');
          expect(res.body.list[0].status).to.equal('DONE');
          done();
        })
        .catch(done);
    });
    it('should delete an item in a todo', (done) => {
      request(app)
        .delete(`/api/todos/${todo.id}/items/${itemId}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.list).to.be.an('array');
          expect(res.body.list.length).to.equal(0);
          done();
        })
        .catch(done);
    });
    it('should get todo details', (done) => {
      request(app)
        .get(`/api/todos/${todo.id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(todo.name);
          expect(res.body.list.length).to.equal(0);
          done();
        })
        .catch(done);
    });
  });
});
