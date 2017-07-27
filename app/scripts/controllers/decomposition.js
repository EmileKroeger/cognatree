'use strict';

/**
 * @ngdoc function
 * @name cognatreeApp.controller:DecompositionCtrl
 * @description
 * # DecompositionCtrl
 * Controller of the cognatreeApp
 */
angular.module('cognatreeApp')
  .controller('DecompositionCtrl', function ($scope, $http) {
    $http.get("data/parentgraph_eng.json").success(function(layers) {
      $scope.layers = layers;
    });
  });
