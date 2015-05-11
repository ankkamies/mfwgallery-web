'use strict';

module.exports = function($scope, $routeParams, postService, authFactory, userService) {

	$scope.user = {};
	$scope.posts = [];

  userService.fetchUser($routeParams.user);

  $scope.$on('userService:refreshUser', function() {
    $scope.user = userService.returnUser();
    userService.fetchUserPosts($scope.user);
  });

  $scope.$on('userService:refreshUserPosts', function() {
  	$scope.posts = userService.returnUserPosts();
  });

  $scope.$on('postService:refresh', function() {
  	userService.fetchUserPosts($scope.user);
  });

};