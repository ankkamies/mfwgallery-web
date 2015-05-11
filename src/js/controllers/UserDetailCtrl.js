'use strict';

module.exports = function($scope, $location, authFactory) {
  $scope.user = authFactory.getUser();

  $scope.loggedUser = authFactory.getUser;

  $scope.send = function() {
    authFactory.update($scope.user, function(err) {
      if (err !== null) {
        console.log(err);
      } else {
        $location.path('/');
      }
    });
  };

  $scope.remove = function() {
    authFactory.remove(function(err) {
      if (err !== null) {
        console.log(err);
      } else {
        $location.path('/');
      }
    });
  };
};

