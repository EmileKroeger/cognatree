'use strict';

/**
 * @ngdoc function
 * @name cognatreeApp.controller:LanguagesCtrl
 * @description
 * # LanguagesCtrl
 * Controller of the cognatreeApp
 */
angular.module('cognatreeApp')
  .controller('LanguagesCtrl', function ($scope, $http) {
    $scope.dtree = null;;
    $http.get('data/dendogram.json').
      success(function(data, status, headers, config) {
        console.debug('data:')
        console.debug(data)
        //$scope.$apply(function() {
          $scope.dtree = data;
          //});
      }).
      error(function(data, status, headers, config) {
        console.debug('error')
        console.debug(status)
      });
  });
