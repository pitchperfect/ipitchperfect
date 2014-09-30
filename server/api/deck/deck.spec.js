'use strict';
/*globals describe, it */

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('/api/decks', function() {

 // it('should allow a new deck to be saved.', function(done) {
 //   var deck = {
 //     title: 'Test Deck',
 //     description: 'Description for test deck.',
 //     questionsCollection: ['Test Question 1: What is your name?',
 //                           'Test Question 2: Who do you work for?'],
 //     active: true,
 //   };
 //
 //   // deck controller. create
 //   request(app)
 //     .post('/api/decks')
 //     .expect(201)
 //     .send(deck)
 //     //.expect('Content-Type', /json/)
 //     .end(
 //       function(err, res) {
 //         if (err) return done(err);
 //         done();
 //       }
 //      );
 // });


  // it('should respond with JSON array of Decks', function(done) {
  //   var questions;
  //
  //   request(app)
  //     .get('/api/decks')
  //     .expect(200)
  //     .expect('Content-Type', /json/)
  //     .end(function(err, res) {
  //       if (err) return done(err);
  //       res.body.should.be.instanceof(Array);
  //       res.body.length.should.be.above(0);
  //       done();
  //     });
  // });
});
