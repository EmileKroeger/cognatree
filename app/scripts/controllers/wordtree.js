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
    };
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
    var FAMCOLORS = {
      'Albanian': '#ffffff',
      'Anatolian': '#ffffff',
      'Armenian': '#ffffff',
      'Celtic / Brittonic': '#ffffff',
      'Celtic / Continental': '#ffffff',
      'Celtic / Goidelic': '#ffffff',
      'Germanic / East': '#00ffff',
      'Germanic / North': '#00aaff',
      'Germanic / North / East': '#3399ff',
      'Germanic / North / West': '#6688ff',
      'Germanic / West / Anglo-Frisian': '#0022ff',
      'Germanic / West / High German': '#2211ff',
      'Germanic / West / Low Franconian': '#4400ff',
      'Greek': '#ffffff',
      'Indo-Iranian': '#ffff00',
      'Oriya': '#ffffff',
      'Osco-Umbrian': '#ffffff',
      'Romance': '#ff00ff',
      'Romance / Eastern': '#ff00ff',
      'Romance / Gallic / Occitan': '#ff00ff',
      'Romance / Gallic / Oil': '#ff00ff',
      'Romance / Gallic / Rhaetian': '#ff00ff',
      'Romance / Iberian': '#ff00ff',
      'Romance / Italo-Dalmatian': '#ff00ff',
      'Romance / Sardinian': '#ff00ff',
      'Slavic': '#00ff00',
      'Slavic / Balto-Slavic': '#00ff00',
      'Slavic / West': '#00ff00',
      };

    return {
      onReady: onReady,
      colors: FAMCOLORS,
    };
  })
  .controller('WordtreeCtrl', function ($scope, $routeParams, $http, sLangInfo) {
    // Prepare families
    sLangInfo.onReady(function(langInfo) {
      console.log('got lang info:');
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
      var byFamily = {};
      sLangInfo.onReady(function(langInfo) {
        angular.forEach(familydata, function(wordInLang, lang) {
          if (wordInLang) {
            var family = '?';
            var color = 'lightgrey';
            if (langInfo[lang]) {
              family = langInfo[lang].Family;
              color = sLangInfo.colors[family];
            }
            var entry = {
              family: family,
              color: color,
              lang: lang,
              writing: wordInLang[0],
              pronunciation: wordInLang[1],
            };
            if (!byFamily[family]) {
              byFamily[family] = [];
            }
            byFamily[family].push(entry);
            delete familydata[lang];
          }
        });
        $scope.byFamily = byFamily;
        $scope.familydata = familydata;
        window.familydata = familydata;
      });
      
    }).
    error(function(data, status) {
      console.debug('error');
      console.debug(status);
    });
    
  });
