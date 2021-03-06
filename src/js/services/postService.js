'use strict';

module.exports = function($http, $rootScope, Upload, sharedDataFactory) {
  var posts = [];
  var post = {};

  var tags = [];
  var tag = {};

  this.fetchPosts = function(ordering) {
  	$http.get(sharedDataFactory.api + '/posts/' + '?ordering=' + ordering)
  	.success(function(data) {
      posts = data;
      $rootScope.$broadcast('postService:refreshPosts');
  	})
    .error(function(data) {
      console.log(data);
    });
  };

  this.fetchPost = function(postId) {
    $http.get(sharedDataFactory.api + '/posts/' + postId + '/')
    .success(function(data) {
      post = data;
      $rootScope.$broadcast('postService:refreshPost');
    })
    .error(function(data) {
      console.log(data);
    });
  };

  this.fetchTags = function() {
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
      $rootScope.$broadcast('postService:refreshTag');
    })
    .error(function(data) {
      console.log(data);
    });
  };

  this.sendComment = function(post, text, callback) {
    $http.post(sharedDataFactory.api + '/posts/' + post + '/comments/',
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

  this.updatePost = function(post, callback) {
    $http.put(sharedDataFactory.api + '/posts/' + post.id + '/', post)
    .success(function(data) {
      callback(null);
    })
    .error(function(data) {
      callback(data);
    });
  };

  this.sendPost = function(post, callback) {
    $http.post(sharedDataFactory.api + '/posts/', post)
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
        progressCallback();
      }).success(function (data, status, headers, config) {
        successCallback(data);
      }).error(function (data) {
        callback(data);
      }); 
    }
  };

  this.removePost = function(post, callback) {
    $http({
        method: 'DELETE', 
        url: sharedDataFactory.api + '/posts/' + post.id + '/'
    })
    .success(function(data) {
      callback(null);
      $rootScope.$broadcast('postService:refresh');
    })
    .error(function(data) {
      callback(data);
    });
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

};

