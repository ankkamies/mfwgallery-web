'use strict';

var _ = require('lodash');
var $ = require('jquery')

module.exports = function($http, $rootScope, $cookies, Upload, sharedDataFactory) {
  var posts = [];
  var post = {};

  var tags = [];
  var tag = {};

  this.fetchPosts = function() {
  	$http.get(sharedDataFactory.api + '/faces/')
  	.success(function(data) {
      posts = data;
      $rootScope.$broadcast('postService:refresh');
  	})
    .error(function(data) {
      console.log(data);
    });
  };

  this.fetchPost = function(postId) {
    $http.get(sharedDataFactory.api + '/faces/' + postId + '/')
    .success(function(data) {
      post = data;
      console.log(post);
      $rootScope.$broadcast('postService:refreshPost');
    })
    .error(function(data) {
      console.log(data);
    });
  };

  this.fetchLatest = function() {
    $http.get(sharedDataFactory.api + '/faces/')
    .success(function(data) {
      posts = data;
      $rootScope.$broadcast('postService:refresh');
    })
    .error(function(data) {
      console.log(data);
    });
  };

  this.fetchTags = function() {
    console.log('fetching tags');
    $http.get(sharedDataFactory.api + '/tags/')
    .success(function(data) {
      tags = data;
      $rootScope.$broadcast('postService:refreshTags');
    })
    .error(function(data) {
      console.log(data);
    });
  };

  this.fetchTag = function(tagId) {
    $http.get(sharedDataFactory.api + '/tags/' + tagId + '/')
    .success(function(data) {
      tag = data;
      console.log(tag);
      $rootScope.$broadcast('postService:refreshTag');
    })
    .error(function(data) {
      console.log(data);
    });
  };

  this.sendComment = function(post, text, callback) {
    $http.post(sharedDataFactory.api + '/faces/' + post + '/comments/',
               {'text': text})
    .success(function(data) {
      callback(null);
      $rootScope.$broadcast('postService:refresh');
    })
    .error(function(data) {
      callback(data);
    });
  };

  this.sendTag = function(text, callback) {
    $http.post(sharedDataFactory.api + '/tags/',
               {'text': text})
    .success(function(data) {
      callback(null);
      $rootScope.$broadcast('postService:refresh');
    })
    .error(function(data) {
      callback(data);
    });
  };

  this.sendPost = function(post, callback) {
    $http.post(sharedDataFactory.api + '/faces/', post)
    .success(function(data) {
      callback(null);
      $rootScope.$broadcast('postService:refresh');
    })
    .error(function(data) {
      callback(data);
    });
  };

  this.uploadImage = function (image, progressCallback, successCallback, callback) {
    if (image && image.length) {
      Upload.upload({
        url: sharedDataFactory.api + '/images/',
        file: image
      }).progress(function (evt) {
        progressCallback(parseInt(100.0 * evt.loaded / evt.total));
      }).success(function (data, status, headers, config) {
        successCallback(data);
      }); 
    }
  };

  this.returnTags = function() {
    return tags;
  };

  this.returnTag = function() {
    return tag;
  };

  this.returnPosts = function() {
    return posts;
  };

  this.returnPost = function() {
    return post;
  };

  this.getLatest = function() {
    return _.first(posts, 5);
  };
};

