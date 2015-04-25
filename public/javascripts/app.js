angular.module('app', ['ui.router'])
	.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/lines");
  $stateProvider
    .state('lines', {
      url: "/lines",
      templateUrl: "partials/lines.html",
      controller: function($scope) {
        $scope.lines = [
          {'id': '203'},
          {'id': '177'},
          {'id': '8'},
          {'id': '97'}
        ];
      }
    })
    .state('lineInfo', {
      url: "/line/:id",
      templateUrl: "partials/lineInfo.html",
      controller: function($scope, $stateParams) {
        $scope.id = $stateParams.id;
      }
    })
    .state('lineMap', {
      url: "/map/:id",
      templateUrl: "partials/lineMap.html",
      controller: function($scope, $stateParams) {
        $scope.id = $stateParams.id;
      }
    })
    .state('login', {
      url: "/login",
      templateUrl: "partials/login.html",
      controller: function($scope) {
      }
    })
    /*-----------------------------*/
    .state('admin', {
      url: "/admin",
      templateUrl: "partials/admin.html",
      controller: function($scope) {
      }
    })
    .state('admin.lines', {
      url: "/lines",
      templateUrl: "partials/admin.lines.html",
      controller: function($scope) {
      }
    })
    .state('admin.newLine', {
      url: "/newLine",
      templateUrl: "partials/admin.newLine.html",
      controller: function($scope) {
      }
    })
    .state('admin.lineInfo', {
      url: "/lineInfo",
      templateUrl: "partials/admin.lineInfo.html",
      controller: function($scope) {
      }
    })
    /*-----------------------------*/
    .state('admin.users', {
      url: "/users",
      templateUrl: "partials/admin.users.html",
      controller: function($scope) {
        $scope.users = [
          {id: '1',username: 'user1', password: 'pass1'},
          {id: '2',username: 'user1', password: 'pass1'},
          {id: '3',username: 'user1', password: 'pass1'}
        ]; 
      }
    })
    .state('admin.newUser', {
      url: "/newUser",
      templateUrl: "partials/admin.newUser.html",
      controller: function($scope) {
      }
    });




	})
  .controller('AppController', ['$scope', function($scope) {
    $scope.name = '555';
  }]);