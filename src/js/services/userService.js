'use strict';

var _ = require('lodash');

module.exports = function($http, $rootScope, sharedDataFactory) {
  var users = [];
  var messages = [];
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

  this.fetchUserMessages = function(user) {
    $http.get(sharedDataFactory.api + '/users/' + user.username + '/faces/')
    .success(function(data) {
      messages = data;
      $rootScope.$broadcast('userService:refreshMessages');
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

  this.returnUserMessages = function() {
    return messages;
  };

};
