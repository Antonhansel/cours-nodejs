const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai');

const expect = chai.expect;
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
    text: 'Cest le test de la todo',
  };

  describe('# POST /api/todos', () => {
    it('should create a new todo', (done) => {
      request(app)
        .post('/todos')
        .send({'text': 'premier test todo'})
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.text).to.equal(todo.text);
          todo = res.body;
          done();
        })
        .catch(done);
    });

  describe('# GET /api/todos/', () => {
    it('should get all todos', (done) => {
      request(app)
        .get('/todos')
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
          .post('/todos')
          .send({'text': 'Second test todo'})
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body.text).to.equal(todo.text);
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
          shortId: todo.shortId
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

  describe('# POST /api/todos/items', () => {
    it('should add an item to a todo', (done) => {
      request(app)
        .post(`/api/todos/${todo.id}/items`)
        .send({text: 'coucoulatodo'})
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.list).to.be.an('array');
          expect(res.body.list.length).to.equal(1);
          done();
        })
        .catch(done);
    });

  });
});
