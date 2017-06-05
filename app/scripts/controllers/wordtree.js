'use strict';

/**
 * @ngdoc function
 * @name cognatreeApp.controller:WordtreeCtrl
 * @description
 * # WordtreeCtrl
 * Controller of the cognatreeApp
 */
angular.module('cognatreeApp')
  .service('sLangInfo', function ($http) {
    var LANGINFO_URL = 'data/langinfo.json';
    var state = {
      langInfo: null,
      running: false,
      callbacks: [],
    }
    var callbacks = [];
    function onReady(callback) {
      if (state.langInfo) {
        // We're already done here!
        callback(state.langInfo);
      } else {
        // We'll get called later on
        state.callbacks.push(callback);
        if (!state.running) {
          // Request data
          state.running = true;
          $http.get(LANGINFO_URL).success(function(langInfo) {
            state.langInfo = state.langInfo;
            state.running = false;
            state.callbacks.forEach(function(callback) {
              callback(langInfo);
            });
          });
        }
      }
    }
    return {
      onReady: onReady,
    }
  })
  .controller('WordtreeCtrl', function ($scope, $routeParams, $http, sLangInfo) {
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
        'Provencal',
        'Romansh',
        'Rumanian',
        'Italian',
        'French',
        'Catalan',
        'Spanish',
        'Portuguese St',
      ],
    ];
    // Prepare families
    sLangInfo.onReady(function(langInfo) {
      console.log("got lang info:");
      console.debug(langInfo);
    });

    // Handle word
    console.debug($routeParams.word);
    $scope.word = $routeParams.word;
    var wordurl = 'data/families/english/' + $scope.word + '.json';
    $scope.branches = [];
    $http.get(wordurl).
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
