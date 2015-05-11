'use strict';

module.exports = function($scope, authFactory, postService) {
  $scope.comment = null;

  $scope.sendComment = function(post) {
    postService.sendComment(post, $scope.comment, function(err) {
      if (err !== null) {
        console.log(err);
      } else {
        postService.fetchPost(post);
        $scope.comment = null;
      }
    });
  };
};

