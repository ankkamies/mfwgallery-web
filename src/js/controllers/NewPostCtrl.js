'use strict';

module.exports = function($scope, $location, Upload, authFactory, postService) {
  $scope.post = {};
  $scope.loggedUser = authFactory.getUser;
  $scope.showLoader = false;

  $scope.post.tags = [];
  $scope.post.image = {};

  $scope.$watch('image', function() {
    postService.uploadImage($scope.image,
      function() {
        $scope.showLoader = true;
      },
      function(image) {
        $scope.post.image = image.id;
        $scope.showLoader = false;
      }, function(err, image) {
        if (err !== null) {
          console.log(err);
        } else {
          $scope.showLoader = false;
        }
      }
    );
  });

  $scope.sendPost = function () {
    $scope.post.tags = $scope.tags.map(function(tag) { return tag.text; });
    postService.sendPost($scope.post, function(err) {
        if (err !== null) {
          console.log(err);
        } else {
          postService.fetchPosts();
          $location.path('/gallery');
        }
      });
  };
};

