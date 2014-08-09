'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var Video = require('./video.model');
var Busboy = require('busboy');
var azure = require('azure');

if(config.env === 'development') {
  var AZ_CREDS = require('../../config/local.env.js');
 };

//azure blob service for storing video
var AZ_ACCT = process.env.AZ_ACCT || AZ_CREDS.AZ_ACCT;
var AZ_KEY = process.env.AZ_KEY || AZ_CREDS.AZ_KEY;
var AZ_HOST = process.env.AZ_HOST || AZ_CREDS.AZ_HOST;


// Get list of videos
exports.index = function(req, res) {
  Video.find(function (err, videos) {
    if(err) { return handleError(res, err); }
    return res.json(200, videos);
  });
};

// Get a single video
exports.show = function(req, res) {

  // Expects video _id passed in URI
  // Example:  ipitchperfect/videos/url/53e40bd2f32ff0ea28a

  var videoName = req.params.id + '.webm';

  var blobService = azure.createBlobService(AZ_ACCT, AZ_KEY, AZ_HOST);

  //create a SAS that expires in 45 mins
  var sharedAccessPolicy = {
      AccessPolicy: {
              Start: azure.date.minutesFromNow(-5),
              Expiry: azure.date.minutesFromNow(45),
              Permissions: azure.Constants.BlobConstants.SharedAccessPermissions.READ
          }
  };

  // Generate signed URL, temporary access to the video
  var sasUrl = blobService.getBlobUrl('vds1', videoName, sharedAccessPolicy);

  // Return VideoURL to client
  res.json(200, {url: sasUrl});

};

// Creates a new video in the DB.
exports.create = function(req, res) {

//This all happens after we get a video _id from mongo
  Video.create(req.body, function(err, video) {

    if(err) { return handleError(res, err); }
    // Use video _id as filename
    var videoId  = video.id;

    var blobService = azure.createBlobService(AZ_ACCT, AZ_KEY, AZ_HOST);
    // Use busboy to parse multi-part form request


    console.log('req.headers=' + req.headers);
    for (var key in req.headers) {
      console.log('header ' + key + ': '+ req.headers[key]);
    }


    var busboy = new Busboy({headers: req.headers});

    console.log('busboy created.')

    // Initiate form processing
    req.pipe(busboy);

    console.log('req.pipe(busboy) called');

    // When file is found, start working with it
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      // Pipe the file stream right into an Azure blob
      // This allows us to avoid storing the file temporarily on the server
      console.log('busboy on file...');

      file.pipe(blobService.createBlob('vds1', videoId + '.webm',
        azure.Constants.BlobConstants.BlobTypes.BLOCK));

      file.on('end', function(data) {
        //add data to the storage object above
        console.log('File  Finished');
      });

    });

    busboy.on('finish', function() {
      console.log('Done parsing form');
    });

    // Return video _id to client
    return res.json(201, video);
  });
};

// Updates an existing video in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Video.findById(req.params.id, function (err, video) {
    if (err) { return handleError(res, err); }
    if(!video) { return res.send(404); }
    var updated = _.merge(video, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, video);
    });
  });
};

// Deletes a video from the DB.
exports.destroy = function(req, res) {
  Video.findById(req.params.id, function (err, video) {
    if(err) { return handleError(res, err); }
    if(!video) { return res.send(404); }
    video.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
