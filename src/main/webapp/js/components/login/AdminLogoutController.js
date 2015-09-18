
//Admin Logout Controller
adminControllers.controller('AdminLogoutController', ['$scope', '$location', '$rootScope' ,'$http',
function ($scope, $location, $rootScope,$http) {
    if($rootScope.sessionId != '') {
		$location.path("#/users/login");
	}
    $http.get("api/v1/users/logout");
	$rootScope.sessionId='';
	$rootScope.bc_discussType = '';
	$rootScope.bc_username = '';
	$rootScope.bc_userId = '';
	$rootScope.bc_userRoleId = '';

	localStorage.setItem("AdminSessionId", "");
	localStorage.setItem("ADMIN_USER_ID", "");
	localStorage.setItem("ADMIN_USER_NAME", "");
	localStorage.setItem("ADMIN_USER_ROLE", "");

	$http.defaults.headers.common.sess = "";
	
	localStorage.removeItem(0);
	localStorage.removeItem(1);
	localStorage.removeItem(2);
	
	var element = document.getElementById("login_placeholder");
	element.innerHTML = "Login";
    element.href = "#/users/login";

	$location.path("/users/login");

}]);
