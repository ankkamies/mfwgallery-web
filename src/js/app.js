'use strict';

var angular      = require('angular'),
    ngRoute      = require('angular-route'),
    ngCookies    = require('angular-cookies'),
    ngFileUpload = require('ng-file-upload'),
    ipCookie     = require('angular-cookies'),
    uiBootstrap  = require('ui-bootstrap');

var module = angular.module('mfwgallery', ['ngRoute', 'ngCookies', 'ngFileUpload', 'ui.bootstrap']);

// Services, factories and providers
module.factory('base64Factory', require('./services/base64Factory'));
module.factory('sharedDataFactory', require('./services/sharedDataFactory'));
module.factory('authFactory', ['$http', '$rootScope', '$cookies', '$timeout', '$browser', 'sharedDataFactory', 'base64Factory', require('./services/authFactory')]);
module.service('postService', ['$http', '$rootScope', '$cookies', 'Upload', 'sharedDataFactory', require('./services/postService')]);
module.service('userService', ['$http', '$rootScope', 'sharedDataFactory', require('./services/userService')]);

// Controllers
module.controller('LoginCtrl', ['$scope', '$location', 'authFactory', require('./controllers/LoginCtrl')]);
module.controller('MainCtrl', ['$scope', '$interval', 'authFactory', 'postService', require('./controllers/MainCtrl')]);
module.controller('UserCtrl', ['$scope', '$interval', 'authFactory', 'userService', require('./controllers/UserCtrl')]);
module.controller('UserDetailsCtrl', ['$scope', '$location', 'authFactory', require('./controllers/UserDetailCtrl')]);
module.controller('RegisterCtrl', ['$scope', '$location', 'authFactory', require('./controllers/RegisterCtrl')]);
module.controller('NewCommentCtrl', ['$scope', 'authFactory', 'postService', require('./controllers/NewCommentCtrl')]);
module.controller('NewPostCtrl', ['$scope', 'Upload', 'authFactory', 'postService', require('./controllers/NewPostCtrl')]);
module.controller('UserDetailsCtrl', ['$scope', '$routeParams', 'postService', 'authFactory', 'userService', require('./controllers/UserDetailsCtrl')]);
module.controller('PostDetailsCtrl', ['$scope', '$routeParams', 'postService', 'authFactory', require('./controllers/PostDetailsCtrl')]);
module.controller('TagDetailsCtrl', ['$scope', '$routeParams', 'postService', require('./controllers/TagDetailsCtrl')]);
module.controller('GalleryCtrl', ['$scope', '$routeParams', '$modal', 'postService', 'authFactory', require('./controllers/GalleryCtrl')]);
module.controller('ModalCtrl', ['$scope', '$modalInstance', 'image', require('./controllers/ModalCtrl')]);
module.controller('TagCanvas', ['$scope', 'postService', require('./controllers/TagCanvas')]);

module.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider, $authProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .when('/details/:user', {
    templateUrl: 'views/userDetails.html',
    controller: 'UserDetailsCtrl'
  })
  .when('/register', {
    templateUrl: 'views/userInfo.html',
    controller: 'RegisterCtrl'
  })
  .when('/gallery', {
    templateUrl: 'views/gallery.html',
    controller: 'GalleryCtrl'
  })
  .when('/posts/:post', {
    templateUrl: 'views/postDetails.html',
    controller: 'PostDetailsCtrl'
  })
  .when('/post', {
    templateUrl: 'views/newPost.html',
    controller: 'NewPostCtrl'
  })
  .when('/tags/:tag', {
    templateUrl: 'views/tagDetails.html',
    controller: 'TagDetailsCtrl'
  })
  .when('/details', {
    templateUrl: 'views/userInfo.html',
    controller: 'UserDetailsCtrl'
  });
}]);
