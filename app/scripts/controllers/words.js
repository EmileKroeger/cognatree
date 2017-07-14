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
    var WORDINDEX_URL = 'data/majorworddescs.json';
    $http.get(WORDINDEX_URL).success(function(worddescs) {
      $scope.worddescs = worddescs;
    });
  });
