'use strict';
/*globals describe, it */

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('/api/questions', function() {

  // it('should allow a question to be created.', function(done) {
  //   var question = {
  //     title: 'Are you happy?',
  //     description: 'Test your mood!',
  //     active: true
  //   }
  //
  //   request(app)
  //     .post('/api/questions')
  //     .expect(201)
  //     .send(JSON.stringify(question))
  //     .expect('Content-Type', /json/)
  //     .end(function(err, res) {
  //
  //       if (err)
  //         console.log(err);
  //
  //       // Not actually sure what the body type would be.
  //       res.body.should.be.instanceof(Object);
  //     });
  // });


  // it('should respond with JSON array of questions', function(done) {
  //   request(app)
  //     .get('/api/questions')
  //     .expect(200)
  //     .expect('Content-Type', /json/)
  //     .end(function(err, res) {
  //       if (err) return done(err);
  //       res.body.should.be.instanceof(Array);
  //       done();
  //     });
  // });
});
