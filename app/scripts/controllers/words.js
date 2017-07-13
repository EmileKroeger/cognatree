'use strict';

/**
 * @ngdoc function
 * @name cognatreeApp.controller:WordsCtrl
 * @description
 * # WordsCtrl
 * Controller of the cognatreeApp
 */
angular.module('cognatreeApp')
  .controller('WordsCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
