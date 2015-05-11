'use strict';

module.exports = function($scope, $location, authFactory) {
  $scope.user = {};

  $scope.loggedUser = authFactory.getUser;

  $scope.send = function() {
    authFactory.register($scope.user, function(err) {
      if (err !== null) {
        console.log(err);
      } else {
        $location.path('/');
      }
    });
  };
};

