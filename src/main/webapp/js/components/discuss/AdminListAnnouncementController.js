adminControllers.controller('AdminListAnnouncementController', ['$scope', '$location', '$rootScope', '$location', 'AdminAnnouncements',
function($scope, $location, $rootScope, $location, AdminAnnouncements) {
	if(localStorage.getItem("AdminSessionId") == '') {
		$location.path('/users/login');
		return;
	}
	if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '')
		 {
			 return;
	 }
	$location.path('/discuss/Announcements');
}]);