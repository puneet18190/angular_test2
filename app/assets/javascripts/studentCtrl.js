var app = angular.module('myapp', ['ngRoute', 'ngResource'])

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

app.controller('studentCtrl', ['$scope','User', function($scope, User){
	$scope.students = User.query()
	$scope.data = "hello world"
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

	$routeProvider.otherwise({
		redirectTo: "/students"
	})
	
}])