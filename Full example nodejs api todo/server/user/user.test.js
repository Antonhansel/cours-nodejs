const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai');

const { expect } = chai;
const app = require('../../index');

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

describe('## User APIs', () => {
  const validUserCredentials = {
    username: 'Newusertest',
    password: 'express',
  };


  describe('# POST /api/users', () => {
    it('should create a new user', (done) => {
      request(app)
        .post('/api/users')
        .send(validUserCredentials)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(validUserCredentials.username);
          expect(res.body.token).to.not.be.undefined; // eslint-disable-line
          done();
        })
        .catch(done);
    });

    it('should not create two users with the same username', (done) => {
      request(app)
        .post('/api/users')
        .send(validUserCredentials)
        .expect(httpStatus.CONFLICT)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/users', () => {
    it('should create a new user even without a phone number', (done) => {
      request(app)
        .post('/api/users')
        .send({
          username: 'testUserName',
          password: 'coucou',
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal('testUserName');
          done();
        })
        .catch(done);
    });
  });

  // describe('# GET /api/users/:userId', () => {
  //   it('should get user details', (done) => {
  //     request(app)
  //       .get(`/api/users/${user._id}`)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body.username).to.equal(user.username);
  //         expect(res.body.mobileNumber).to.equal(user.mobileNumber);
  //         done();
  //       })
  //       .catch(done);
  //   });

  //   it('should report error with message - Not found, when user does not exists', (done) => {
  //     request(app)
  //       .get('/api/users/56c787ccc67fc16ccc1a5e92')
  //       .expect(httpStatus.NOT_FOUND)
  //       .then((res) => {
  //         expect(res.body.message).to.equal('Not Found');
  //         done();
  //       })
  //       .catch(done);
  //   });
  // });

  // describe('# PUT /api/users/:userId', () => {
  //   it('should update user details', (done) => {
  //     user.username = 'KK';
  //     request(app)
  //       .put(`/api/users/${user._id}`)
  //       .send(user)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body.username).to.equal('KK');
  //         expect(res.body.mobileNumber).to.equal(user.mobileNumber);
  //         done();
  //       })
  //       .catch(done);
  //   });
  // });

  describe('# GET /api/users/', () => {
    it('should refuse to get all users', (done) => {
      request(app)
        .get('/api/users')
        .expect(httpStatus.NOT_FOUND)
        .then(() => {
          done();
        })
        .catch(done);
    });

    // it('should get all users', (done) => {
    //   request(app)
    //     .get('/api/users')
    //     .expect(httpStatus.OK)
    //     .then((res) => {
    //       expect(res.body).to.be.an('array');
    //       done();
    //     })
    //     .catch(done);
    // });

    // it('should get all users (with limit and skip)', (done) => {
    //   request(app)
    //     .get('/api/users')
    //     .query({ limit: 10, skip: 1 })
    //     .expect(httpStatus.OK)
    //     .then((res) => {
    //       expect(res.body).to.be.an('array');
    //       done();
    //     })
    //     .catch(done);
    // });
  });

  // describe('# DELETE /api/users/', () => {
  //   it('should delete user', (done) => {
  //     request(app)
  //       .delete(`/api/users/${user._id}`)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body.username).to.equal('KK');
  //         expect(res.body.mobileNumber).to.equal(user.mobileNumber);
  //         expect(res.body.deviceId).to.equal(user.deviceId);
  //         done();
  //       })
  //       .catch(done);
  //   });
  // });
});
