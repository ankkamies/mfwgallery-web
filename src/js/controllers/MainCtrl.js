'use strict';

module.exports = function($scope, $interval, authFactory, postService) {
  var updatePosts;

  $scope.posts = [];
  $scope.showPostControls = false;
  $scope.loggedUser = authFactory.getUser;

  if ($scope.loggedUser().username !== undefined) {
    postService.fetchLatest();
  } else {
    postService.fetchPosts();
  }

  $scope.showControls = function() {
    if ($scope.post === null || typeof $scope.post === "undefined" || $scope.post.length === 0) {
      $scope.showPostControls = !$scope.showPostControls;
    }
  };

  updatePosts = $interval(function() {
    if ($scope.loggedUser().username !== undefined) {
      postService.fetchLatest();
    } else {
      postService.fetchPosts();
    }
  }, 60000);

  $scope.$on('postService:refresh', function() {
    $scope.posts = postService.getLatest();
  });

  $scope.$on('postService:reload', function() {
    if ($scope.loggedUser().username !== undefined) {
      postService.fetchLatest();
    } else {
      postService.fetchPosts();
    }
  });

  $scope.$on('authFactory:login' , function() {
    postService.fetchLatest();
  });

  $scope.$on('authFactory:logout' , function() {
    postService.fetchPosts();
  });

  // Cancel post updates on scope destroy
  $scope.$on('$destroy', function() {
    $interval.cancel(updatePosts);
  });
};
