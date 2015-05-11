'use strict';

module.exports = function($scope, Upload, authFactory, postService) {
  $scope.post = {};
  $scope.loggedUser = authFactory.getUser;
  $scope.progress = 0.0;

  $scope.post.tags = [];
  $scope.post.image = {};

  $scope.uploadImage = function () {
    postService.uploadImage($scope.image,
      function(progress) {
        $scope.progress = progress;
      },
      function(image) {
        $scope.post.image = image.id;
      }, function(err, image) {
        if (err !== null) {
          console.log(err);
        } else {
          postService.fetchPosts();
          $scope.post = null;
        }
      });
  };

  $scope.sendPost = function () {
    postService.sendPost($scope.post, function(err) {
        if (err !== null) {
          console.log(err);
        } else {
          postService.fetchPosts();
          $scope.post = null;
        }
      });
  };
};

