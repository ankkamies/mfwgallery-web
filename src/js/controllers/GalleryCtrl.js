'use strict';

module.exports = function($scope, $routeParams, postService, authFactory, userService) {

	$scope.user = {};
	$scope.posts = [];

  postService.fetchPosts();

  $scope.$on('postService:refresh', function() {
  	$scope.posts = postService.returnPosts();
  });

};