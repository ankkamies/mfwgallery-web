'use strict';

module.exports = function($scope, $interval, authFactory, userService) {
  var updateUsers;

  $scope.users = [];
  $scope.loggedUser = authFactory.getUser;

  userService.fetchUsers();

  $scope.$on('userService:refresh', function() {
    $scope.users = userService.returnUsers();
  });

  $scope.$on('postService:reload', function() {
    userService.fetchUsers();
    authFactory.fetchUser();
  });

  $scope.$on('authFactory:login', function() {
    userService.fetchUsers();
  });

  $scope.$on('authFactory:logout', function() {
    userService.fetchUsers();
  });

  // Cancel post updates on scope destroy
  $scope.$on('$destroy', function() {
    $interval.cancel(updateUsers);
  });
};
