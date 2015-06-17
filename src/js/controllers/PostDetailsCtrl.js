'use strict';

module.exports = function($scope, $location, $routeParams, postService, authFactory) {

  $scope.post = {};

  postService.fetchPost($routeParams.post);
  $scope.loggedUser = authFactory.getUser;

  $scope.alerts = [];

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.removePost = function() {
    postService.removePost($scope.post, function(err) {
      if (err !== null) {
      } else {
        $scope.post = null;
        $location.path('/gallery');
      }
    });
  }

  $scope.updatePost = function() {
    var tags = $scope.post.tags.map(function(tag) { return tag.text; });
    postService.updatePost({id: $scope.post.id, description: $scope.post.description, tags: tags}, function(err) {
      if (err !== null) {
        $scope.alerts.push({msg: 'You dun goofed.', type: 'danger'});
      } else {
        postService.fetchPost($scope.post.id);
        $scope.showEditBox = false;
        $scope.alerts.push({msg: 'Post updated successfully!', type: 'success'});
      }
    });
  } 

  $scope.$on('postService:refreshPost', function() {
    $scope.post = postService.returnPost();
  });

  $scope.$on('postService:refresh', function() {
    if($scope.post !== null) {
      $scope.post = postService.fetchPost($scope.post.id);      
    }
  });

};
