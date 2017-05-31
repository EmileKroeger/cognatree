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
    var BRANCHES = [
      [
        'Proto-Indo-European',
      ],
      [
        'Old English',
        'English',
      ],
      [
        'Frisian',
        'Dutch List',
        'Flemish',
      ],
      [
        'Gothic',
        'Old High German',
        'German',
        'Standard German (Munich)',
      ],
      [
        'Old Norse',
        'Norwegian',
        'Danish',
        'Danish Fjolde',
        'Icelandic St',
      ],
      [
        'Old Swedish',
        'Swedish',
      ],
      [
        'Latin',
        "Provencal",
        "Romansh",
        "Rumanian",
        "Italian",
        "French",
        'Catalan',
        'Spanish',
        'Portuguese St',
      ],
    ];
    console.debug($routeParams.word);
    $scope.word = $routeParams.word;
    var url = 'data/families/english/' + $scope.word + '.json';
    $scope.branches = [];
    $http.get(url).
    success(function(familydata) {
      console.debug('data:');
      console.debug(familydata);
      $scope.meaning = familydata._MEANING;
      delete familydata._MEANING;
      BRANCHES.forEach(function(branchLanguages) {
        var branch = [];
        branchLanguages.forEach(function(lang) {
          var lang_val = familydata[lang];
          if (lang_val) {
            var entry = {
              lang: lang,
              writing: lang_val[0],
              pronunciation: lang_val[1],
            };
            branch.push(entry);
            delete familydata[lang];
          }
        });
        if (branch.length) {
          $scope.branches.push(branch);
        }
      });
      $scope.familydata = familydata;
      window.familydata = familydata;
    }).
    error(function(data, status) {
      console.debug('error');
      console.debug(status);
    });
    
  });
