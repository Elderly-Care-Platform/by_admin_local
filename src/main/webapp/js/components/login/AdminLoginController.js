
adminControllers.controller('AdminLoginController', ['$scope', '$route', '$http', '$location', '$rootScope',
   function ($scope, $route, $http, $location, $rootScope) {
	
	var element = document.getElementById("login_placeholder");
	element.innerHTML = "Login";
    element.href = "#/users/login";
	
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
	
       $scope.user = {};
       $scope.user.email = '';
       $scope.user.password = '';
       $scope.loginUser = function(user) {
           $scope.resetError();
           $http.defaults.headers.common.sess = localStorage.getItem("AdminSessionId");
           $http.post('/byadmin/api/v1/users/login', user).success(function(login) {
        	   login = login.data;
			if(login.sessionId===null) {
			       $scope.setError(login.status);
   					return;
               }
               $scope.user.email = '';
               $scope.user.password = '';
   				$rootScope.sessionId=login.sessionId;
   				$rootScope.bc_discussType = 'A';
   				$rootScope.bc_username = login.userName;
   				$rootScope.bc_userId = login.id;

				$rootScope.bc_userRoleId = login.userRoleId;
				var destination = 'users/login';

				if ("localStorage" in window)
				{
					localStorage.setItem("AdminSessionId", login.sessionId);
					localStorage.setItem("ADMIN_USER_ID", login.id);
					localStorage.setItem("ADMIN_USER_NAME", login.userName);
					localStorage.setItem("ADMIN_USER_ROLE", $rootScope.bc_userRoleId );

					var element = document.getElementById("login_placeholder");
					element.innerHTML = "Logout";
					element.href = "#/users/logout/"+login.sessionId;

					///######## role based menu ############//
					if(localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR')
					{
						if(document.getElementById('manage_articles')) document.getElementById('manage_articles').style.display = 'block';
						if(document.getElementById('manage_posts'))document.getElementById('manage_posts').style.display = 'block';
						if(document.getElementById('manage_questions'))document.getElementById('manage_questions').style.display = 'block';
						if(document.getElementById('manage_users'))document.getElementById('manage_users').style.display = 'none';
						destination = 'discuss/A';

            		}
					else if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '')
					{
						if(document.getElementById('manage_articles'))document.getElementById('manage_articles').style.display = 'none';
						if(document.getElementById('manage_posts'))document.getElementById('manage_posts').style.display = 'none';
						if(document.getElementById('manage_questions')) document.getElementById('manage_questions').style.display = 'none';
						if(document.getElementById('manage_users')) document.getElementById('manage_users').style.display = 'none';

						$scope.user.email = '';
						$scope.user.password = '';
						$rootScope.sessionId = '';
						$rootScope.bc_discussType = '';
						$rootScope.bc_username = '';
						$rootScope.bc_userId = '';

						var element = document.getElementById("login_placeholder");
						element.innerHTML = "Logout";
						element.href = "#/users/logout/"+login.sessionId;
					}
            		else if(localStorage.getItem("ADMIN_USER_ROLE") == 'SUPER_USER')
					{
						if(document.getElementById('manage_articles'))document.getElementById('manage_articles').style.display = 'block';
						if(document.getElementById('manage_posts')) document.getElementById('manage_posts').style.display = 'block';
						if(document.getElementById('manage_questions')) document.getElementById('manage_questions').style.display = 'block';
						if(document.getElementById('manage_users'))document.getElementById('manage_users').style.display = 'block';
						destination = 'users/all';
					}
					else
					{
						if(document.getElementById('manage_articles')) document.getElementById('manage_articles').style.display = 'none';
						if(document.getElementById('manage_posts')) document.getElementById('manage_posts').style.display = 'none';
						if(document.getElementById('manage_questions')) document.getElementById('manage_questions').style.display = 'none';
						if(document.getElementById('manage_users')) document.getElementById('manage_users').style.display = 'none';

						$scope.user.email = '';
					    $scope.user.password = '';
						$rootScope.sessionId = '';
						$rootScope.bc_discussType = '';
						$rootScope.bc_username = '';
   						$rootScope.bc_userId = '';

   						var element = document.getElementById("login_placeholder");
						element.innerHTML = "Logout";
						element.href = "#/users/logout/"+login.sessionId;
            		}
					///######## role based menu ############//


				}
				else
				{
					$scope.setError('Browser does not support cookies');
					$location.path("#/users/login");
				}

				$location.path(destination);
				$route.reload();
				return;

           }).error(function() {
	           $scope.error = 'Invalid user/password combination';
				$scope.message = '';
           });
       }

       $scope.resetError = function() {
           $scope.error = '';
           $scope.message = '';
       }

       $scope.setError = function(message) {
           $scope.error = message;
           $scope.message = '';
           $rootScope.SessionId='';
           $rootScope.bc_userRoleId = '';
       }
   }]);
