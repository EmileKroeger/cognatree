'use strict';

/**
 * @ngdoc function
 * @name cognatreeApp.controller:WordsCtrl
 * @description
 * # WordsCtrl
 * Controller of the cognatreeApp
 */
angular.module('cognatreeApp')
  .controller('WordsCtrl', function ($scope, $http) {
    var WORDINDEX_URL = 'data/families/english/_index.json';
    $http.get(WORDINDEX_URL).success(function(words) {
      $scope.words = words;
    });
  });
