'use strict';

/**
 * @ngdoc function
 * @name cognatreeApp.controller:WordtreeCtrl
 * @description
 * # WordtreeCtrl
 * Controller of the cognatreeApp
 */
angular.module('cognatreeApp')
  .controller('WordtreeCtrl', function ($scope, $routeParams, $http) {
    console.debug($routeParams.word);
    $scope.word = $routeParams.word;
    var url = 'data/families/english/' + $scope.word + '.json';
    $http.get(url).
    success(function(familydata) {
      console.debug('data:');
      console.debug(familydata);
      $scope.meaning = familydata._MEANING;
      delete familydata._MEANING;
      $scope.familydata = familydata;
      window.familydata = familydata;
    }).
    error(function(data, status) {
      console.debug('error');
      console.debug(status);
    });
    
  });
