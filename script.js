var app = angular.module("fireLearning", ["firebase","ngRoute"]);
var ref = new Firebase("https://glowing-inferno-7011.firebaseio.com");

app.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider){
	$routeProvider
	.when('/',{
		controller: "AuthCtrl",
		templateUrl: "/index.html"
	}).
	otherwise({
		redirectTo: '/'
	});
}]);
var app = angular.module("fireLearning", ["firebase"]);

app.factory("Auth", function($firebaseAuth){
	return $firebaseAuth(ref);
});

app.controller("AuthCtrl", function($scope, Auth, $location){
	$scope.provider = '';
	$scope.authData;

	Auth.$onAuth(function(authData){
		$scope.authData = authData;
		if(authData) {
			$scope.cachedProfile = getCachedProfile();
			createUser();
			//$location.path("/authenticated");
		}
		console.log($scope.authData);
	});

	$scope.login = function(provider) {
		Auth.$authWithOAuthPopup(provider,  { scope: 'email' })
		.catch(function(error){
			console.error(error);
		})
	}

	$scope.logout = function() {
		Auth.$unauth();
	}

	var createUser = function() {
		ref.createUser($scope.cachedProfile, function(error, userData) {
			if (error) {
	 			switch (error.code) {
					case "EMAIL_TAKEN":
						console.log("无法创建新的用户帐户，因为电子邮件已经在使用中了.");
						break;
					case "INVALID_EMAIL":
						console.log("指定的电子邮件不是一个有效的电子邮件.");
						break;
					default:
						console.log("错误创建用户:", error);
				}
			} else {
				console.log("成功创建用户帐户UID:", userData.uid);
			}
		});
	}

	var getCachedProfile = function() {
		if(!$scope.authData) return "";

		switch($scope.authData.provider) {
			case "github":
				return $scope.authData.github.cachedUserProfile;
				break;
			case "facebook":
				return $scope.authData.facebook.cachedUserProfile;
				break;
			case "google":
				return $scope.authData.google.cachedUserProfile;
				break;
			default:
				return "";
		}
	}

	$scope.getUserImage = function() {
		if(!$scope.authData) return "";
		
		switch($scope.authData.provider) {
			case "github":
				return $scope.authData.github.cachedUserProfile.avatar_url ? $scope.authData.github.cachedUserProfile.avatar_url : "";
				break;
			case "facebook":
				return $scope.authData.facebook.profileImageURL ? $scope.authData.facebook.profileImageURL : "";
				break;
			case "google":
				return $scope.authData.google.profileImageURL ? $scope.authData.google.profileImageURL : "";
				break;
			default:
				return "";
		}
	}
});