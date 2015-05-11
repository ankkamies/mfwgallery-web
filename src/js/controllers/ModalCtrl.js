'use strict';

module.exports = function($scope, $modalInstance, image) {

  $scope.image = image;

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

};