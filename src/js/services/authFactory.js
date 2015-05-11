'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Cookies = require('js-cookie')

module.exports = function($http, $rootScope, $cookies, $timeout, $browser, sharedDataFactory, base64Factory) {
  // Current user object
  var settings = {
    user: {},
  };

  // Initialize authentication headers
  $http.defaults.headers.common.Authorization = '';

  var clearUser = function() {
    for (var prop in settings.user) {
      if (settings.user.hasOwnProperty(prop)) {
        delete settings.user[prop];
      }
    }
  };

  return {
    login: function(user, pass) {
      if (typeof user !== "undefined" && typeof pass !== "undefined") {
        var encoded = base64Factory.encode(user + ':' + pass);
        $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
      } else if ($cookies.auth === null || $cookies.auth === "undefined") {
        return;
      }

      $http.post(sharedDataFactory.api + '/auth/login/')
      .success(function(data) {
        $cookies.auth = encoded;
        settings.user = data;
        $rootScope.$broadcast('authFactory:login');
      })
      .error(function(data) {
        $cookies.auth = "undefined";
        clearUser();
        $http.defaults.headers.common.Authorization = '';
      });

    },

    logout: function() {
      $http.defaults.headers.common.Authorization = '';
      $cookies.auth = "undefined";
      clearUser();
      $rootScope.$broadcast('authFactory:logout');
    },

    register: function(user, callback) {
      $http.post(sharedDataFactory.api + '/auth/register/', user)
      .success(function(data) {
        callback(null);
      })
      .error(function(data) {
        callback(data);
      });
    },

    update: function(user, callback) {
      $http.put(sharedDataFactory.api + '/users/' + settings.user.id, user)
      .success(function(data) {
        settings.user = data;
        var encoded = base64Factory.encode(user.username + ':' + user.password);
        $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
        $cookies.auth = encoded;
        callback(null);
      })
      .error(function(data) {
        callback(data);
      });
    },

    remove: function(callback) {
      $http({method: 'DELETE', url: sharedDataFactory.api + '/users/' + settings.user.id})
      .success(function(data) {
        $http.defaults.headers.common.Authorization = '';
        $cookies.auth = "undefined";
        clearUser();
        $rootScope.$broadcast('authFactory:logout');
        callback(null);
      })
      .error(function(data) {
        callback(data);
      });
    },

    fetchUser: function() {
      $http.get(sharedDataFactory.api + '/users/' + settings.user.id)
      .success(function(data) {
        settings.user = data;
        $rootScope.$broadcast('authFactory:refresh');
      })
      .error(function(data) {
        console.log(data);
      });
    },

    getUser: function() {
      return settings.user;
    }
  };
};

