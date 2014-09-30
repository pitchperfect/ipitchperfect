'use strict';

var express = require('express');
var controller = require('./userdeck.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id/response', auth.isAuthenticated(), controller.updateResponse);
router.put('/:id/review', auth.isAuthenticated(), controller.updateReview);

//router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
