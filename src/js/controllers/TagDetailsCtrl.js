'use strict';

module.exports = function($scope, $routeParams, postService) {

  $scope.tag = {};
  $scope.posts = [];

  postService.fetchTag($routeParams.tag);

  $scope.$on('postService:refreshTag', function() {
    $scope.tag = postService.returnTag();
    $scope.posts = $scope.tag.faces;
  });

  $scope.$on('postService:refresh', function() {
    $scope.tag = postService.fetchTag($scope.tag.text);
  });


};