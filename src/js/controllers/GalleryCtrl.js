'use strict';

module.exports = function($scope, $routeParams, $modal, postService, authFactory, userService) {

	$scope.user = {};
	$scope.posts = [];
  $scope.image = '';

  postService.fetchPosts();

  $scope.openModal = function(image) {
    $scope.image = image
    var modalInstance = $modal.open({
      templateUrl: 'views/galleryModalContent.html',
      controller: 'ModalCtrl',
      resolve: {
        image: function () {
          return $scope.image;
        }
      }
    });
  }

  $scope.$on('postService:refresh', function() {
  	$scope.posts = postService.returnPosts();
  });

};