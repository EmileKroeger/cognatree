'use strict';

/**
 * @ngdoc overview
 * @name cognatreeApp
 * @description
 * # cognatreeApp
 *
 * Main module of the application.
 */
angular
  .module('cognatreeApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/languages', {
        templateUrl: 'views/languages.html',
        controller: 'LanguagesCtrl'
      })
      .when('/wordtree/:word', {
        templateUrl: 'views/wordtree.html',
        controller: 'WordtreeCtrl'
      })
      .when('/word/:index', {
        templateUrl: 'views/wordtree.html',
        controller: 'WordtreeCtrl'
      })
      .when('/words', {
        templateUrl: 'views/words.html',
        controller: 'WordsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
