var app = angular.module('myapp', ['ngRoute', 'ngResource', 'Devise'])

app.factory('User',['$resource', function($resource){
	return $resource('/students.json', {}, {
		query: {method: "GET", isArray: true},
		create: { method: 'POST' }
	})
}])

app.factory("Users", ['$resource', function($resource){
	return $resource('/students/:id.json', {}, {
		show: {method: "GET"},
		update: {method: "PUT", params: {id: '@id'}},
		delete: {method: "DELETE", params: {id: '@id'}}
	})
}])

app.controller('studentCtrl', ['$scope','User','Users', function($scope, User, Users){
	$scope.students = User.query()
	$scope.data = "hello world"
	$scope.delete_record = function(id){
		console.log("id"+ id)
		Users.delete({id: id}, function(){
			console.log("success")
		}, function(error){
			console.log(error)
		})
	}
}])

app.controller('studentNewCtrl', ['$scope','User','$location', function($scope, User, $location){
	$scope.user = {}
	$scope.save_data = function(){
		User.create({student: $scope.user}, function(){
			console.log("success")
			$location.path('/');
		}, function(error){
			console.log(error)
		})
	}
}])

app.controller("studentShowCtrl", ['$scope', '$routeParams','Users', function($scope, $routeParams, Users){
	$scope.data = Users.get({id: $routeParams.id})
}])

app.controller('studentEditCtrl', ['$scope','Users','$location', '$routeParams', function($scope, Users, $location, $routeParams){
	$scope.user = Users.get({id: $routeParams.id})
	$scope.data = "edit page"
	$scope.update_data = function(){
		Users.update({student: $scope.user, id: $routeParams.id}, function(){
			console.log("success")
			$location.path('/');
		}, function(error){
			console.log(error)
		})
	}
}])

app.controller("NavCtrl", ['$scope', 'Auth','$location','$rootScope', function($scope, Auth, $location, $rootScope){
	$scope.signedIn = Auth.isAuthenticated;
	$scope.logout = Auth.logout;

	Auth.currentUser().then(function (user){
	    $scope.user = user;
	});

	$scope.$on('devise:new-registration', function (e, user){
	    $scope.user = user;
	});

	$scope.$on('devise:login', function (e, user){
	    $scope.user = user;
	});

	$scope.$on('devise:logout', function (e, user){
	    $scope.user = {};
	    $rootScope.loggedInUser = null;
	    $location.path('/login')
	});

	$scope.login = function() {
	    Auth.login($scope.user).then(function(){
	    	$rootScope.loggedInUser = $scope.user;
	      	$location.path('/students')
	    });
	};

	$scope.register = function() {
	    Auth.register($scope.user).then(function(){
	      $location.path('/students')
	    });
	};
	  
}])

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider.when("/students",{
		templateUrl: "/templates/students/index.html",
		controller: "studentCtrl"
	});

	$routeProvider.when("/students/new",{
		templateUrl: "/templates/students/new.html",
		controller: "studentNewCtrl"
	});

	$routeProvider.when("/students/:id",{
		templateUrl: "/templates/students/show.html",
		controller: "studentShowCtrl"
	});

	$routeProvider.when("/students/:id/edit",{
		templateUrl: "/templates/students/edit.html",
		controller: "studentEditCtrl"
	});

	$routeProvider.when("/login",{
		templateUrl: "/templates/students/login.html",
		controller: "NavCtrl"
	});

	$routeProvider.when("/register",{
		templateUrl: "/templates/students/register.html",
		controller: "NavCtrl"
	});

	$routeProvider.otherwise({
		redirectTo: "/students"
	});
	
}])

app.run(['$rootScope', '$location', function($rootScope, $location) {
	console.log("dsds")
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
    	console.log($rootScope)
		if ($rootScope.loggedInUser == null) {
			console.log(next.templateUrl)
			// no logged user, redirect to /login
			if ( next.templateUrl === "/templates/students/login.html") {
				console.log("aaa")
			}else if(next.templateUrl === "/templates/students/register.html"){

			}else {
				$location.path("/login");
				console.log("bb")
			}
		}
    });
}]);