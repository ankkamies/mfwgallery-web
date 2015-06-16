'use strict';

module.exports = function($scope, $location, authFactory) {
  // Call login once to check if we have cookied authentication data
  authFactory.login();

  $scope.collapsed = true;

  $scope.user = {
    'username': null,
    'password': null,
  };

  $scope.loggedUser = authFactory.getUser;

  $scope.login = function() {
    authFactory.login($scope.user.username, $scope.user.password);
  };

  $scope.logout = function() {
    authFactory.logout();
  };
};
