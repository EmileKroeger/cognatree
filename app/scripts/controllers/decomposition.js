'use strict';

/**
 * @ngdoc function
 * @name cognatreeApp.controller:DecompositionCtrl
 * @description
 * # DecompositionCtrl
 * Controller of the cognatreeApp
 */
angular.module('cognatreeApp')
  .controller('DecompositionCtrl', function ($scope, $http, sLangInfo) {
    $http.get('data/parentgraph_eng.json').success(function(layers) {
      $scope.layers = layers;
    });
    $scope.familyColors = sLangInfo.colors;
    $scope.families = [
      'Germanic',
      'Romance',
      'Greek',
      'Celtic',
      'Indo-Iranian',
      'non Indo-European',
    ];
  });
