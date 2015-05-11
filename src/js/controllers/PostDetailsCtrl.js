'use strict';

module.exports = function($scope, $routeParams, postService) {

  $scope.post = {};

  postService.fetchPost($routeParams.post);

  $scope.$on('postService:refreshPost', function() {
    $scope.post = postService.returnPost();
    console.log($scope.post);
  });

  $scope.$on('postService:refresh', function() {
    $scope.post = postService.fetchPost($scope.post.id);
  });


};