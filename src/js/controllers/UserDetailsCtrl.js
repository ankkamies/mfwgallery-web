'use strict';

module.exports = function($scope, $routeParams, postService, authFactory, userService) {

	$scope.user = {};
  $scope.post = {};
	$scope.posts = [];

  userService.fetchUser($routeParams.user);
  postService.fetchPost($routeParams.post);

  $scope.$on('userService:refreshUser', function() {
    $scope.user = userService.returnUser();
    userService.fetchUserPosts($scope.user);
  });

  $scope.$on('postService:refreshPost', function() {
    $scope.post = postService.returnPost();
  });

  $scope.$on('userService:refreshPosts', function() {
  	$scope.posts = userService.returnUserPosts();
  });

  $scope.$on('postService:refresh', function() {
  	userService.fetchUserPosts($scope.user);
  });

};