'use strict';

module.exports = function($scope, $routeParams, postService, authFactory) {

  $scope.post = {};

  postService.fetchPost($routeParams.post);
  $scope.loggedUser = authFactory.getUser;

  $scope.removePost = function() {
    postService.removePost($scope.post, function(err) {
      if (err !== null) {
      } else {
        $scope.post = null;
      }
    });
  }

  $scope.updatePost = function() {
    var tags = $scope.post.tags.map(function(tag) { return tag.text; });
    postService.updatePost({id: $scope.post.id, description: $scope.post.description, tags: tags}, function(err) {
      if (err !== null) {
      } else {
        postService.fetchPost($scope.post.id);
      }
    });
  } 

  $scope.$on('postService:refreshPost', function() {
    $scope.post = postService.returnPost();
    console.log($scope.post);
  });

  $scope.$on('postService:refresh', function() {
    $scope.post = postService.fetchPost($scope.post.id);
  });

};
