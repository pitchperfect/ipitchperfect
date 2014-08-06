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

    /** This User creates a NEW DECK **/
    Deck.create({
      userId: userId,
      title: "Facebook Deck",
      questions: [],
      active: true
    }, function(err, newDeck) {

      var deckId = newDeck._id;

      /** This User creates a NEW QUESTION within the newly created Deck **/
      Question.create({
        userId: userId,
        deck: deckId,
        title: "Tell me what happens when you type www.facebook.com?",
        description: "1min 30sec long",
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


        /** This user creates a NEW RESPONSE to a Question**/
        Response.create({
          userId: userId,
          deck: deckId,
          question: questionId,
          questionTitle: questionTitle,
          description: "1min 30sec long",
          video: "new video",
          textVideo: "new text video",
          active: true,
        }, function (err, newResponse) {

          var responseId = newResponse._id;

          /** The first response to a Deck by user creates a NEW USERDECK **/
          Userdeck.create({
            userId: userId,
            deck: deckId,
            questionsResponded: {},
            responsesReviewed: {},
            active: true,

          }, function (err, newUserdeck) {
            var userdeckId = newUserdeck._id;

            // Userdeck.findById(userdeckId, function (err, userdeck) {
              var questionsResponded = 'questionsResponded.' + questionId;
              var responsesReviewed = 'responsesReviewed.' + responseId;

              var keysToUpdate = {};
              keysToUpdate[questionsResponded] = responseId;
              keysToUpdate[responsesReviewed] = [];

              newUserdeck.update( { $set: keysToUpdate }, function() { console.log('Update Succeeded');});
            // });

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
