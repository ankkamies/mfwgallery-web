'use strict';

module.exports = function($scope, $routeParams, $modal, postService, authFactory, userService) {

	$scope.user = {};
	$scope.posts = [];
  $scope.image = '';
  $scope.order = {'description': 'Newest first', 'ordering': '-created'};

  $scope.items = [
    {'description': 'Newest first', 'ordering': '-created'},
    {'description': 'Oldest first', 'ordering': 'created'}
  ];

  postService.fetchPosts($scope.order.ordering);

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

  $scope.status = {
    isopen: false
  };

  $scope.select = function(choice) {
    $scope.order = choice;
    postService.fetchPosts($scope.order.ordering);
  }

  $scope.$on('postService:refreshPosts', function() {
  	$scope.posts = postService.returnPosts();
  });

  $scope.$on('postService:refresh', function() {
    postService.fetchPosts();
  });

};