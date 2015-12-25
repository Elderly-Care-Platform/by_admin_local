adminControllers.controller('AdminListAnnouncementController', ['$scope', '$rootScope', '$location', 'AdminAnnouncements',
function($scope, $rootScope, $location, AdminAnnouncements) {
	if(localStorage.getItem("AdminSessionId") == '') {
		$location.path('/users/login');
		return;
	}
	if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '')
		 {
			 return;
	 }
	$rootScope.bc_discussType = 'Announcements';
	$location.path('/discuss/Announcements');
}]);