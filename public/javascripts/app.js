angular.module('app', ['ui.router', 'uiGmapgoogle-maps'])
	.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/lines");
  $stateProvider
    .state('lines', {
      url: "/lines",
      templateUrl: "partials/lines.html",
      controller: function($scope, $http, $state) {
        $scope.get = function(q){  
          if(!q) q = '';        
          $http.get('/lines/' + q).
            success(function(data, status, headers, config) {
              console.log(data);
              $scope.lines = data;
            }).
            error(function(data, status, headers, config) {
              $state.go('login');
            });
        };
        $scope.search = function(q){
          $scope.get(q);
        };
        $scope.get();
      }
    })
    .state('lineInfo', {
      url: "/line/:id",
      templateUrl: "partials/lineInfo.html",
      controller: function($scope, $stateParams, $http, $state) {
        $scope.id = $stateParams.id;
        $scope.gotoMap = function(id){
          console.log(id);
          $state.go('lineMap', {id: id});
        };
        $scope.get = function(q){  
          if(!q) q = '';        
          $http.get('/lines/' + q).
            success(function(data, status, headers, config) {
              console.log(data);
              $scope.lines = data;
            }).
            error(function(data, status, headers, config) {
              $state.go('login');
            });
        };
        $scope.get($scope.id);
      }
    })
    .state('lineMap', {
      url: "/map/:id",
      templateUrl: "partials/lineMap.html",
      controller: function($scope, $stateParams, $state) {
        $scope.id = $stateParams.id;
        $scope.move = function(){
          $scope.myloc.coords.latitude+=0.5;
          $scope.myloc.coords.longitude-=0.5;
        };
        $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 6 };
        $scope.station = {
          id: 0,
          coords: {
            latitude: 40.1451,
            longitude: -99.6680
          },
          options: { draggable: true },
          events: {
            dragend: function (marker, eventName, args) {
              $log.log('marker dragend');
              var lat = marker.getPosition().lat();
              var lon = marker.getPosition().lng();
              $log.log(lat);
              $log.log(lon);

              $scope.marker.options = {
                draggable: true,
                labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                labelAnchor: "100 0",
                labelClass: "marker-labels"
              };
            }
          }
        };
        $scope.myloc = {
          id: 0,
          coords: {
            latitude: 40.1451,
            longitude: -98.0680
          },
          options: { draggable: true },
          events: {
            dragend: function (marker, eventName, args) {
              $log.log('marker dragend');
              var lat = marker.getPosition().lat();
              var lon = marker.getPosition().lng();
              $log.log(lat);
              $log.log(lon);

              $scope.marker.options = {
                draggable: true,
                labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                labelAnchor: "100 0",
                labelClass: "marker-labels"
              };
            }
          }
        };
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
      controller: function($scope, $http, $state) {
        $scope.get = function(){          
          $http.get('/api/lines').
            success(function(data, status, headers, config) {
              console.log(data);
              $scope.lines = data;
            }).
            error(function(data, status, headers, config) {
              $state.go('login');
            });
        };
        $scope.delete = function(_id){
          $http.delete('/api/lines/' + _id).
            success(function(data, status, headers, config) {
              console.log(data);
              $scope.get();
            }).
            error(function(data, status, headers, config) {
              $state.go('login');
            });
        };
        $scope.get();
      }
    })
    .state('admin.newLine', {
      url: "/newLine",
      templateUrl: "partials/admin.newLine.html",
      controller: function($scope, $http, $state) {
        $scope.line = {};

        $scope.submit = function(){
          console.log($scope.line);
          $http.post('/api/lines', $scope.line).
            success(function(data, status, headers, config) {
              console.log(data);
              $state.go('admin.lines');
            }).
            error(function(data, status, headers, config) {
              $state.go('login');
            });
        };
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
      controller: function($scope, $http, $state) {
        $scope.get = function(){          
          $http.get('/api/users').
            success(function(data, status, headers, config) {
              console.log(data);
              $scope.users = data;
            }).
            error(function(data, status, headers, config) {
              $state.go('login');
            });
        };
        $scope.delete = function(_id){
          $http.delete('/api/users/' + _id).
            success(function(data, status, headers, config) {
              console.log(data);
              $scope.get();
            }).
            error(function(data, status, headers, config) {
              $state.go('login');
            });
        };
        $scope.get();
      }
    })
    .state('admin.newUser', {
      url: "/newUser",
      templateUrl: "partials/admin.newUser.html",
      controller: function($scope, $http, $state) {
        $scope.submit = function(){
          $http.post('/api/users', $scope.user).
            success(function(data, status, headers, config) {
              console.log(data);
              $state.go('admin.users');
            }).
            error(function(data, status, headers, config) {
              $state.go('login');
            });
        };
      }
    });




	})
  .controller('AppController', ['$scope', function($scope) {
    $scope.name = '555';
  }]);