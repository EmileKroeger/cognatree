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
      .otherwise({
        redirectTo: '/'
      });
  });
