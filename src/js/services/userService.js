'use strict';

var _ = require('lodash');

module.exports = function($http, $rootScope, sharedDataFactory) {
  var users = [];
  var posts = [];
  var user = {};

  this.fetchUsers = function() {
  	$http.get(sharedDataFactory.api + '/users/')
  	.success(function(data) {
      users = data;
      $rootScope.$broadcast('userService:refresh');
  	})
    .error(function(data) {
      console.log(data);
    });
  };

  this.fetchUser = function(username) {
    console.log(username);
    $http.get(sharedDataFactory.api + '/users/' + username + '/')
    .success(function(data) {
      user = data;
      $rootScope.$broadcast('userService:refreshUser');
    })
    .error(function(data) {
      console.log(data);
    });
  };

  this.fetchUserPosts = function(user) {
    $http.get(sharedDataFactory.api + '/users/' + user.username + '/posts/')
    .success(function(data) {
      posts = data;
      $rootScope.$broadcast('userService:refreshUserPosts');
    })
    .error(function(data) {
      console.log(data);
    });
  };

  this.returnUsers = function() {
    return users;
  };

  this.returnUser = function() {
    return user;
  };

  this.returnUserPosts = function() {
    return posts;
  };

};
