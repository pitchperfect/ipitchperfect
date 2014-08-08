/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Deck = require('../api/deck/deck.model');
var Question = require('../api/question/question.model');
var Response = require('../api/response/response.model');
var Userdeck = require('../api/userdeck/userdeck.model');

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

Deck.find({}).remove(function() { console.log('Decks deleted')});
Question.find({}).remove(function() { console.log('Questions deleted')});
Response.find({}).remove(function() { console.log('Responses deleted')});
Userdeck.find({}).remove(function() { console.log('Userdecks deleted')});

/** Find all user - delete all stored **/
User.find({}).remove(function() {
  console.log('Users deleted');


  /** Create a NEW USER: 'test' **/
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, function(err, newUser) {

    var userId = newUser._id;

    /* Create NEW DECK 1*/
    Deck.create({
      userId: userId,
      title: 'AngularJS - Tech#3',
      description: 'See how well you do with these general Angular questions.',
      questions: [],
      active: true
    }, function(err, newDeck1) {
      var deck1Id = newDeck1._id;
    });

    /* Create NEW DECK 2*/
    Deck.create({
      userId: userId,
      title: 'Hack Reactor: Softball Questions - Tech#1',
      description: 'Good start for those new to technical interviews. This deck features 4 simple technical questions that are meant to give you a chance to become comfortable with the interview experience.',
      questions: [],
      active: true
    }, function(err, newDeck2) {
      var deck2Id = newDeck2._id;
    });

    /** This User creates a NEW DECK **/
    Deck.create({
      userId: userId,
      title: 'Hack Reactor: JavaScript (Core) - Tech#2',
      description: 'This interview deck provides you with an opportunity to shine as you amaze and astound potential employers with your awe-inspiring JavaScript skills. Features 4 questions.',
      questions: [],
      active: true
    }, function(err, newDeck3) {

      var deck3Id = newDeck3._id;
    });

    Deck.create({
      userId: userId,
      title: 'Facebook - Tech#1',
      description: 'Explore social media centered softwares platforms',
      questions: [],
      active: true
    }, function(err, newDeck4) {

      var deck4Id = newDeck4._id;
    });

    /** This User creates a NEW DECK **/
    Deck.create({
      userId: userId,
      title: 'Google - Tech#1',
      description: 'Test your CS fundamentals',
      questions: [],
      active: true
    }, function(err, newDeck) {

      var deckId = newDeck._id;
      var deckTitle = newDeck.title;
      var deckDescription = newDeck.description;
      var deckQuestions = newDeck.questions;
      var secondQuestionId = ''; // reference later;

      /** This User creates a NEW QUESTION within the newly created Deck **/
      Question.create({
        userId: userId,
        deck: deckId,
        title: "Explain what happens when you type www.google.com?",
        promptVideo: "video prompt",
        active: true,
      }, function (err, newQuestion1) {

        secondQuestionId = newQuestion1._id;
        var question1Title = newQuestion1.title;


        /** UPDATE DECK ASSOCIATED to this question by inserting a reference to itself **/
        Deck.findById(deckId, function (err, deck) {
          deck.questions.push(secondQuestionId);
          deck.save();
        });

      });

      Question.create({
        userId: userId,
        deck: deckId,
        title: "Why do you want to be a software engineer?",
        promptVideo: "video prompt",
        active: true,
      }, function (err, newQuestion) {

        var questionId = newQuestion._id;
        var questionTitle = newQuestion.title;


        /** UPDATE DECK ASSOCIATED to this question by inserting a reference to itself **/
        Deck.findById(deckId, function (err, deck) {
          deck.questions.push(questionId);
          deck.save();
        });



        /** user ACCEPTS a deck & creates a NEW USERDECK **/
        Userdeck.create({
          userId: userId,
          deckId: deckId,
          title: deckTitle,
          description: deckDescription,
          questions : [questionId, secondQuestionId],
          questionsResponded: {},
          responsesReviewed: {},
          active: true,

        }, function (err, newUserdeck) {
          var userDeckId = newUserdeck._id;

          var questionsResponded = 'questionsResponded.' + questionId;

          var keysToUpdate = {};
          keysToUpdate[questionsResponded] = 0;

          newUserdeck.update( { $set: keysToUpdate }, function() { console.log('Update Succeeded');});



          /** This user creates a NEW RESPONSE to a Question in a UserDeck**/
          Response.create({
            userId: userId,
            deck: deckId,
            userDeck: userDeckId,
            question: questionId,
            questionTitle: questionTitle,
            description: "1min 30sec long",
            video: "new video",
            textVideo: "new text video",
            active: true,
          }, function (err, newResponse) {

            var responseId = newResponse._id;


            /** UPDATE USERDECK linked to this response. **/
            Userdeck.findById(userDeckId, function (err, userdeck) {

              var questionsResponded = 'questionsResponded.' + questionId;
              var responsesReviewed = 'responsesReviewed.' + responseId;

              var keysToUpdate = {};
              keysToUpdate[questionsResponded] = responseId;
              keysToUpdate[responsesReviewed] = [];

              newUserdeck.update( { $set: keysToUpdate }, function() {
                console.log('Update Succeeded');
              });

            });



          });

        });

      });

    });

  });


  User.create({
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});
