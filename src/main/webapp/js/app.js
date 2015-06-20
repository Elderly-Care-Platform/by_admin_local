var adminServices = angular.module("adminServices", ["ngResource"]);
var adminControllers = angular.module("adminControllers", []);




var discuss = adminServices.factory('SessionIdService', function() {
    var sessionID = '';
    return {
        getSessionId: function() {
            if(sessionID=='' || sessionID==null)
            {
				if ("localStorage" in window)
				{
               		sessionID = localStorage.getItem("SessionId");
				}
				else
				{
					alert("No local storage");
				}
			}

            console.log("Get sessionId => " + sessionID);

            return sessionID;
        },

        setSessionId: function(sessId) {
            console.log("Set sessionId=" + sessId);
            localStorage.setItem("SessionId", sessId);
            sessionID = sessId;
            return;
        }
    }
});




//User
var user_admin = adminServices.factory('AdminUser', function($resource) {
	return $resource('/byadmin/api/v1/users/:userId',{}, {
		remove:{method: 'DELETE', params: {userId: '@id'}},
		update:{method: 'PUT', params: {userId: '@id'}},
		get: {method: 'GET', params: {userId: '@id'}}
	})
});

var userShow_admin = adminServices.factory('AdminUserShow', function($resource) {
	return $resource('/byadmin/api/v1/users/show/:userId',{}, {
		show: {method: 'GET', params: {userId: '@id'}},
		get: {method: 'GET', params: {userId: '@id'}}
	})
});

var userEdit_admin = adminServices.factory('AdminUserEdit', function($resource) {
	return $resource('/byadmin/api/v1/users/edit/:userId',{}, {
		get: {method: 'GET', params: {userId: '@id'}}
	})
});

var userByFilter_admin = adminServices.factory('AdminUserList', function($resource) {
	return $resource('/byadmin/api/v1/users/list/all',{}, {

	})
});


//Discuss - admin
var discuss_admin = adminServices.factory('AdminDiscuss', function($resource) {
	return $resource('/byadmin/api/v1/discuss/:discussId',{}, {
		remove:{method: 'DELETE', params: {discussId: '@id'}},
		update:{method: 'PUT', params: {discussId: '@id'}},
		get: {method: 'GET', params: {discussId: '@id'}}
	})
});


var discussByFilterPost_admin = adminServices.factory('AdminPostDiscuss', function($resource) {
	return $resource('/byadmin/api/v1/discuss/list/P',{}, {
	})
});

var discussByFilterFeedback_admin = adminServices.factory('AdminFeedbackDiscuss', function($resource) {
	return $resource('/byadmin/api/v1/discuss/list/F',{}, {
	})
});


var discussByFilterQuestion_admin = adminServices.factory('AdminQuestionDiscuss', function($resource) {
	return $resource('/byadmin/api/v1/discuss/list/Q',{}, {
	})
});

var discussByFilterArticle_admin = adminServices.factory('AdminArticleDiscuss', function($resource) {
	return $resource('/byadmin/api/v1/discuss/list/A',{}, {
	})
});


var discussByFilter_admin = adminServices.factory('AdminDiscussList', function($resource) {
	return $resource('/byadmin/api/v1/discuss/list/all',{}, {

	})
});


//////////////////////////////// comments ///////////////////////////////////////////////////
var commentByFilter_admin = adminServices.factory('AdminCommentList', function($resource) {
	return $resource('/byadmin/api/v1/comment/:parentId/:ancestorId',{}, {
		//get: {method: 'GET', params: {parentId: '@discussId', ancestorId: '@ancestorId'}}

	})
});

var discuss_admin = adminServices.factory('AdminComment', function($resource) {
	return $resource('/byadmin/api/v1/comment/:commentId',{}, {
		remove:{method: 'DELETE', params: {commentId: '@id'}},
		update:{method: 'PUT', params: {commentId: '@id'}},
		get: {method: 'GET', params: {commentId: '@id'}}
	})
});
//////////////////////////////// comments ///////////////////////////////////////////////////

var discussShow_admin = adminServices.factory('AdminDiscussShow', function($resource) {
	return $resource('/byadmin/api/v1/discuss/show/:discussId',{}, {
		show: {method: 'GET', params: {discussId: '@id'}},
		get: {method: 'GET', params: {discussId: '@id'}}
	})
});



var byAdminApp = angular.module('byAdminApp', [
 	"adminControllers",
 	"adminServices"
 ]);



byAdminApp.directive('bindHtmlUnsafe', function( $compile ) {
    return function( $scope, $element, $attrs ) {

        var compile = function( newHTML ) { // Create re-useable compile function
            newHTML = $compile(newHTML)($scope); // Compile html
            $element.html('').append(newHTML); // Clear and append it
        };

        var htmlName = $attrs.bindHtmlUnsafe; // Get the name of the variable
                                              // Where the HTML is stored

        $scope.$watch(htmlName, function( newHTML ) { // Watch for changes to
                                                      // the HTML
            if(!newHTML) return;
            compile(newHTML);   // Compile it
        });

    };
});


byAdminApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/comment/:parentId/:ancestorId', {templateUrl: 'views/discuss/list2.html', controller: 'CommentListController'})
    .when('/comment/:commentId', {templateUrl: 'views/discuss/edit2.html', controller: 'AdminCommentCreateController'})
	.when('/comment/edit/:commentId', {templateUrl: 'views/discuss/list2.html', controller: 'AdminCommentCreateController'})
	.when('/comment/delete/:commentId', {templateUrl: 'views/discuss/list2.html', controller: 'AdminCommentDeleteController'})

    .when('/users/all', {templateUrl: 'views/users/list.html', controller: 'AdminUserListController'})
    .when('/users/new', {templateUrl: 'views/users/create.html', controller: 'AdminUserCreateController'})
    .when('/users/showedit/:userId', {templateUrl: 'views/users/edit.html', controller: 'AdminUserEditController'})
    .when('/users/showedit/:userId', {templateUrl: 'views/users/edit.html', controller: 'AdminUserCreateController'})
    .when('/users/delete/:userId', {templateUrl: 'views/users/list.html', controller: 'AdminUserDeleteController'})
    .when('/users/login', {templateUrl: 'views/users/login.html', controller: 'AdminLoginController'})
    .when('/users/logout/:sessionId', {templateUrl: 'views/users/list.html', controller: 'AdminLogoutController'})
    .when('/discuss/all', {templateUrl: 'views/discuss/list.html', controller: 'AdminDiscussListController'})
    .when('/discuss/P', {templateUrl: 'views/discuss/list.html', controller: 'AdminListPostController'})
    .when('/discuss/F', {templateUrl: 'views/discuss/feedbackList.html', controller: 'AdminListFeedbackController'})
      .when('/discuss/Q', {templateUrl: 'views/discuss/list.html', controller: 'AdminListQuestionController'})
      .when('/discuss/A', {templateUrl: 'views/discuss/list.html', controller: 'AdminListArticleController'})
      .when('/discuss/new/P', {templateUrl: 'views/discuss/create.html', controller: 'AdminDiscussCreateController'})
	  .when('/discuss/new/Q', {templateUrl: 'views/discuss/create.html', controller: 'AdminDiscussCreateController'})
	  .when('/discuss/new/A', {templateUrl: 'views/discuss/create.html', controller: 'AdminDiscussCreateController'})
	  .when('/discuss/showedit/:discussId', {templateUrl: 'views/discuss/edit.html', controller: 'AdminDiscussCreateController'})
	  .when('/discuss/edit/:discussId', {templateUrl: 'views/discuss/list.html', controller: 'AdminDiscussCreateController'})
	  .when('/discuss/delete/:discussId', {templateUrl: 'views/discuss/list.html', controller: 'AdminDiscussDeleteController'})
      .when('/discuss/:discussId', {templateUrl: 'views/discuss/detail.html', controller: 'AdminDiscussDetailController'});
    //?????$routeProvider.otherwise({redirectTo: '/users/login'});
  }]);


//Routing and Session Check for Login
byAdminApp.run(function($rootScope, $location, SessionIdService) {

    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function(event, next, current) {

        console.log("Routechanged... ");

       	var session = SessionIdService.getSessionId();
       	if (session == '' || session == null) {

            // no logged user, we should be going to #login
            if (next.templateUrl == "views/users/login.html") {
            // already going to #login, no redirect needed
            } else {
                // not going to #login, we should redirect now
            	$location.path("/users/login");
            }
        }
    });
});




adminControllers.controller('AdminUserCreateController', ['$scope', '$routeParams', '$location', 'AdminUser',
  function($scope, $routeParams, $location, AdminUser) {
	  	if(localStorage.getItem("USER_ROLE") == 'WRITER' || localStorage.getItem("USER_ROLE") == 'USER' || localStorage.getItem("USER_ROLE") == '' || localStorage.getItem("USER_ROLE") == 'EDITOR')
	  			 {
	  				 return;
	 }
     var userId = $routeParams.userId;
     	if(userId != null )
	 	{
	 		$scope.user = AdminUser.get({userId: userId});
	 		$scope.edituser = function () {
	 			$scope.user.$save(function (user, headers) {
	 				toastr.success("Edited User");
	 				$location.path('/users/all');
	 			});
	 		};
	 	}
	 	else
	 	{
	 		$scope.user = new AdminUser();

			$scope.register = function () {
				if($scope.userForm.$invalid) return;
				$scope.user.$save(function (user, headers)
				{

					$scope.message = "User registered successfully";
					$scope.error = '';
					$scope.submitted = true;
					$location.path('/users/all');

				}, function (error) {
					// failure
					console.log("$save failed " + JSON.stringify(error));
					$scope.error = 'Error in registering.Check your inputs and try again. Make sure that the Email is unique to the system.';
					$scope.message = '';
					$scope.submitted = false;
					$scope.userName = '';
					$scope.email = '';
					$scope.password = '';
					$scope.userRoleId = '';

					$location.path('/users/new');

				});

			};
		}
  }]);




//User Edit
adminControllers.controller('AdminUserEditController', ['$scope', '$routeParams', '$location', 'AdminUserShow',
  function($scope, $routeParams, $location, AdminUserShow) {
	  	if(localStorage.getItem("USER_ROLE") == 'WRITER' || localStorage.getItem("USER_ROLE") == 'USER' || localStorage.getItem("USER_ROLE") == '' || localStorage.getItem("USER_ROLE") == 'EDITOR')
	  			 {
	  				 return;
	 }
	var userId = $routeParams.userId;
    $scope.user = AdminUserShow.get({userId: userId});
  }]);



//User Delete
adminControllers.controller('AdminUserDeleteController', ['$scope', '$routeParams', '$location', 'AdminUser',
  function($scope, $routeParams, $location, AdminUser) {
	  	if(localStorage.getItem("USER_ROLE") == 'WRITER' || localStorage.getItem("USER_ROLE") == 'USER' || localStorage.getItem("USER_ROLE") == '' || localStorage.getItem("USER_ROLE") == 'EDITOR')
	  			 {
	  				 return;
	 }
    var userId = $routeParams.userId;
	$scope.user = AdminUser.remove({userId: userId});
	$scope.users = AdminUser.query();
	$location.path('/users/all');
	toastr.success("Deleted User");
  }]);


//User Listing
adminControllers.controller('AdminUserListController', ['$scope', '$location', 'AdminUserList',
	function($scope, $location, AdminUserList) {

		if(localStorage.getItem("USER_ROLE") == 'WRITER' || localStorage.getItem("USER_ROLE") == 'USER' || localStorage.getItem("USER_ROLE") == '' || localStorage.getItem("USER_ROLE") == 'EDITOR')
		{
			$location.path('/users/login');
			return;
	 	}

	   $scope.users = AdminUserList.query();
	}]);


//Admin Logout Controller
adminControllers.controller('AdminLogoutController', ['$scope', '$location', '$rootScope' ,
function ($scope, $location, $rootScope) {
    if($rootScope.sessionId != '') {
		$location.path("#/users/login");
	}
	$rootScope.sessionId='';
	$rootScope.bc_discussType = '';
	$rootScope.bc_username = '';
	$rootScope.bc_userId = '';
	$rootScope.bc_userRoleId = '';

	localStorage.setItem("SessionId", "");
	localStorage.setItem("USER_ID", "");
	localStorage.setItem("USER_NAME", "");
	localStorage.setItem("USER_ROLE", "");

	localStorage.removeItem(0);
	localStorage.removeItem(1);
	localStorage.removeItem(2);

	window.location.reload();
	$location.path("users/login");

}]);

adminControllers.controller('AdminLoginController', ['$scope', '$route', '$rootScope', '$http', '$location', '$rootScope',
   function ($scope, $route, $rootScope, $http, $location, $rootScope) {

       $scope.user = {};
       $scope.user.email = '';
       $scope.user.password = '';
       $scope.loginUser = function(user) {
           $scope.resetError();
           $http.post('/byadmin/api/v1/users/login', user).success(function(login) {
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

   				if(login.userName == 'admin')
   				{
					$rootScope.bc_userRoleId = 'SUPER_USER';
				}
				else
				{
   					$rootScope.bc_userRoleId = login.userRoleId;
				}


				var destination = 'users/login';

				if ("localStorage" in window)
				{
					localStorage.setItem("SessionId", login.sessionId);
					localStorage.setItem("USER_ID", login.id);
					localStorage.setItem("USER_NAME", login.userName);
					localStorage.setItem("USER_ROLE", $rootScope.bc_userRoleId );

					var element = document.getElementById("login_placeholder");
					element.innerHTML = "Logout";
					element.href = "#/users/logout/"+login.sessionId;

					///######## role based menu ############//
					if(localStorage.getItem("USER_ROLE") == 'EDITOR')
					{
						if(document.getElementById('manage_articles')) document.getElementById('manage_articles').style.display = 'block';
						if(document.getElementById('manage_posts'))document.getElementById('manage_posts').style.display = 'block';
						if(document.getElementById('manage_questions'))document.getElementById('manage_questions').style.display = 'block';
						if(document.getElementById('manage_users'))document.getElementById('manage_users').style.display = 'none';
						destination = 'discuss/A';

            		}
					else if(localStorage.getItem("USER_ROLE") == 'WRITER' || localStorage.getItem("USER_ROLE") == 'USER' || localStorage.getItem("USER_ROLE") == '')
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
            		else if(localStorage.getItem("USER_ROLE") == 'SUPER_USER')
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

//DISCUSS

adminControllers.controller('AdminDiscussListController', ['$scope', '$location', 'AdminDiscussList',
  function($scope, $location, AdminDiscussList) {
	  if(localStorage.getItem("USER_ROLE") == 'WRITER' || localStorage.getItem("USER_ROLE") == 'USER' || localStorage.getItem("USER_ROLE") == '')
	  	 {

	  		 $location.path('/users/login');
	  		 return;
	 }
     $scope.discuss = AdminDiscussList.query();
  }]);




/////////////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////
//Answer and comments
adminControllers.controller('CommentListController', ['$scope', '$location', 'AdminCommentList',
  function($scope, $location, AdminCommentList) {
	 if(localStorage.getItem("USER_ROLE") == 'WRITER' || localStorage.getItem("USER_ROLE") == 'USER' || localStorage.getItem("USER_ROLE") == '')
	 {

	  	$location.path('/users/login');
	  	return;
	 }
	 var discussId = $location.path().substring($location.path().lastIndexOf('/')+1);
     //???????$scope.comment = AdminCommentList.query({parentId:discussId,ancestorId:discussId});

  }]);

adminControllers.controller('AdminCommentCreateController', ['$scope', '$http', '$location', '$route', '$routeParams', '$location', 'AdminComment',
  function($scope, $http, $location, $route, $routeParams, $location, AdminComment) {
	 $scope.currentComment = '';
	 if(localStorage.getItem("SessionId") == '') {
		$location.path('/users/login');
		return;
	 }
	 if(localStorage.getItem("USER_ROLE") == 'WRITER' || localStorage.getItem("USER_ROLE") == 'USER' || localStorage.getItem("USER_ROLE") == '')
	 {
		 $location.path('/users/login');
		 return;
	 }
	 var segment = $location.path();

	 //P or Q or A
	 segment = segment.substring(segment.lastIndexOf('/')+1);
     var commentId = $routeParams.commentId;

		//EDIT MODE
	 	if(commentId != null )
	 	{

			$scope.currentComment = AdminComment.get({commentId:commentId});

	 		$scope.editcomment = function () {

				//putting the userId to discuss being created
				$scope.currentComment.userId = localStorage.getItem("USER_ID");
				$scope.currentComment.userName = localStorage.getItem("USER_NAME");


	 			$scope.currentComment.$save(function () {
					toastr.success('Comment edited successfully');
					$location.path('/comment/'+ $scope.currentComment.discussId + '/' + $scope.currentComment.discussId);
	 			});
	 		};


	 		$location.path('/comment/' + commentId);

	 	}
	 }]);

/////////////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////




adminControllers.controller('AdminListQuestionController', ['$scope', '$location', '$rootScope', '$location', 'AdminQuestionDiscuss',
function($scope, $location, $rootScope, $location, AdminQuestionDiscuss) {
	if(localStorage.getItem("SessionId") == '') {
		$location.path('/users/login');
		return;
	}
	if(localStorage.getItem("USER_ROLE") == 'WRITER' || localStorage.getItem("USER_ROLE") == 'USER' || localStorage.getItem("USER_ROLE") == '')
		 {
			 return;
	 }
	$scope.discuss = AdminQuestionDiscuss.query();
	$scope.discuss.discussType = 'Q';
	$rootScope.bc_discussType = 'Q';
	$location.path('/discuss/Q');
}]);

adminControllers.controller('AdminListPostController', ['$scope', '$location', '$rootScope', '$location', 'AdminPostDiscuss',
function($scope, $location, $rootScope, $location, AdminPostDiscuss) {
	if(localStorage.getItem("SessionId") == '') {
		$location.path('/users/login');
		return;
	}
	if(localStorage.getItem("USER_ROLE") == 'WRITER' || localStorage.getItem("USER_ROLE") == 'USER' || localStorage.getItem("USER_ROLE") == '')
		 {
			 $location.path('/users/login');
			 return;
	 }
	$scope.discuss = AdminPostDiscuss.query();
	$scope.discuss.discussType = 'P';
	$rootScope.bc_discussType = 'P';
	$location.path('/discuss/P');
}]);

adminControllers.controller('AdminListArticleController', ['$scope', '$location', '$rootScope', '$location', 'AdminArticleDiscuss',
function($scope, $location, $rootScope, $location, AdminArticleDiscuss) {
	if(localStorage.getItem("SessionId") == '') {
		$location.path('/users/login');
		return;
	}
	if(localStorage.getItem("USER_ROLE") == 'WRITER' || localStorage.getItem("USER_ROLE") == 'USER' || localStorage.getItem("USER_ROLE") == '')
		 {
			 $location.path('/users/login');
			 return;
	 }
	$scope.discuss = AdminArticleDiscuss.query();
	$scope.discuss.discussType = 'A';
	$rootScope.bc_discussType = 'A';
	$location.path('/discuss/A');
}]);


adminControllers.controller('LoadTMController', ['$scope', '$route',
  function($scope, $route) {
	tinymce.init({
    selector: "textarea",
    plugins: [
        "advlist autolink lists link image charmap print preview anchor",
        "searchreplace visualblocks code fullscreen",
        "insertdatetime media table contextmenu paste"
    ],
    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
	});


	}
]);




adminControllers.controller('AdminDiscussCreateController', ['$scope', '$http', '$location', '$route', '$routeParams', '$location', 'AdminDiscuss',
  function($scope, $http, $location, $route, $routeParams, $location, AdminDiscuss) {
	 if(localStorage.getItem("SessionId") == '') {
		$location.path('/users/login');
		return;
	 }
	 if(localStorage.getItem("USER_ROLE") == 'WRITER' || localStorage.getItem("USER_ROLE") == 'USER' || localStorage.getItem("USER_ROLE") == '')
	 {
		 $location.path('/users/login');
		 return;
	 }
	 var segment = $location.path();

	//P or Q or A
	 segment = segment.substring(segment.lastIndexOf('/')+1);
     var discussId = $routeParams.discussId;
		//EDIT MODE
	 	if(discussId != null )
	 	{
	 		$scope.currentDiscuss = AdminDiscuss.get({discussId:discussId});
	 		$scope.editdiscuss = function () {
	 			var htmlval = tinyMCE.activeEditor.getContent();

				if(htmlval == '')
				{

					htmlval = document.getElementById('texta').value;

				}

				$scope.currentDiscuss.text=htmlval;

				//putting the userId to discuss being created
				$scope.currentDiscuss.userId = localStorage.getItem("USER_ID");
				$scope.currentDiscuss.username = localStorage.getItem("USER_NAME");


	 			$scope.currentDiscuss.$save(function () {
					toastr.success('Edited successfully');
					var location = $scope.currentDiscuss.discussType;
					$location.path('/discuss/' + location);
	 			});
	 		};
	 	}
	 	//CREATE MODE
	 	else
	 	{
	 		$scope.currentDiscuss = new AdminDiscuss();
	 		$scope.currentDiscuss.discussType = segment;

	 		$scope.register = function () {
				var htmlval = tinymce.activeEditor.getContent();
				if(htmlval == '')
				{
					htmlval = document.getElementById('text').val;
				}

				$scope.currentDiscuss.text=htmlval;

				//putting the userId to discuss being created
				$scope.currentDiscuss.userId = localStorage.getItem("USER_ID");
				$scope.currentDiscuss.username = localStorage.getItem("USER_NAME");


				//save the discuss
				$scope.currentDiscuss.$save(function () {
					toastr.success('Created successfully');
					var location = $scope.currentDiscuss.discussType;
					$location.path('/discuss/' + location);
				});


				/*
				$http.post('/byadmin/api/v1/discuss', $scope.discuss).success(function(headers) {

				}).error(function() {
				   	$scope.error = 'Error in creating discuss';
					$scope.message = '';
				});*/
				};
		}//else
  }]);






adminControllers.controller('AdminDiscussEditController', ['$scope', '$location', '$routeParams', '$location', 'AdminDiscussShow',
  function($scope, $location, $routeParams, $location, AdminDiscussShow) {
	  if(localStorage.getItem("USER_ROLE") == 'WRITER' || localStorage.getItem("USER_ROLE") == 'USER' || localStorage.getItem("USER_ROLE") == '')
	  	 {
	  		 $location.path('/users/login');
	  		 return;
	 }
	var discussId = $routeParams.discussId;
	$scope.discuss = AdminDiscussShow.show({discussId: discussId});
    tinyMCE.activeEditor.setContent($scope.discuss.text, {format : 'raw'});

  }]);

adminControllers.controller('AdminDiscussDetailController', ['$scope', '$location', '$routeParams', '$location', 'AdminDiscussShow',
  function($scope, $location, $routeParams, $location, AdminDiscussShow) {
	  if(localStorage.getItem("USER_ROLE") == 'WRITER' || localStorage.getItem("USER_ROLE") == 'USER' || localStorage.getItem("USER_ROLE") == '')
	  	 {
	  		 $location.path('/users/login');
	  		 return;
	 }
     var discussId = $routeParams.discussId;
    $scope.discuss = AdminDiscussShow.show({discussId: discussId});
  }]);


adminControllers.controller('AdminDiscussDeleteController', ['$scope', '$location', '$rootScope', '$routeParams', '$location', 'AdminDiscuss',
  function($scope, $location, $rootScope, $routeParams, $location, AdminDiscuss) {
	  if(localStorage.getItem("USER_ROLE") == 'WRITER' || localStorage.getItem("USER_ROLE") == 'USER' || localStorage.getItem("USER_ROLE") == '')
	  	 {
	  		 $location.path('/users/login');
	  		 return;
	 }
     var discussId = $routeParams.discussId;
     $scope.discuss = AdminDiscuss.get({discussId:discussId});

	var loc = $rootScope.bc_discussType;

	$scope.discuss = AdminDiscuss.remove({discussId: discussId});

	toastr.success('Deleted successfully');

	//TODO - thsi is not working - not redirecting after a delete - so hard-codng t to Show Articles NOW
	$location.path('/discuss/' + loc);
  }]);



var UserRoleController = function($scope) {
    $scope.userRoleIds =
    [
        "SUPER_USER",
        "WRITER",
        "EDITOR",
        "USER"
    ];
};


var UserStateController = function($scope) {
    $scope.isActives =
    [
        "In-Active",
        "Active"
    ];
};



//Topic/Sub Topic drop down in DISCUSS Create
var option1Options =	[
		"BEAUTIFUL LIVES",
		"ELDER'S ROUTINE",
		"HEALTH CONDITIONS",
		"CAREGIVER'S CORNER",
		"FAMILY AND RELATIONSHIPS"

	];

var option2Options = [
		["Stars forever","Personal stories"],
		["Chores","Medications", "Personal hygiene", "Food & Nutrition", "Mobility", "Activities"],
		["Alzheimer's and dementia","Parkinson's", "Mental disorders", "Broken hip", "Stroke", "Heart", "Arthritis", "Diabetes", "Incontinence", "Vision & Hearing loss", "Cancer", "Respiratory", "Kidney", "Digestive system", "Sleep disorders", "Osteoporosis", "Other"],
		["Caregiving guides","Stress and burnout", "Personal stories"]

	];



function myCtrl($scope){
    $scope.options1 = option1Options;
    $scope.options2 = []; // we'll get these later
    $scope.getOptions2 = function(){
        // just some silly stuff to get the key of what was selected since we are using simple arrays.
        var key = $scope.options1.indexOf($scope.discuss.topicId);
        // Here you could actually go out and fetch the options for a server.
        var myNewOptions = option2Options[key];
        // Now set the options.
        // If you got the results from a server, this would go in the callback
        $scope.options2 = myNewOptions;
    };
    $scope.getOptionsforId = function(topicId){
        // just some silly stuff to get the key of what was selected since we are using simple arrays.
        var key = $scope.options1.indexOf(topicId);
        // Here you could actually go out and fetch the options for a server.
        var myNewOptions = option2Options[key];
        // Now set the options.
        // If you got the results from a server, this would go in the callback
        $scope.options2 = myNewOptions;
    };
    $scope.getOption = function(topicId){
        // just some silly stuff to get the key of what was selected since we are using simple arrays.
        return $scope.options1.indexOf(topicId);
    };
    $scope.getSubOption = function(topicId, subTopicId){
    	var key = $scope.options1.indexOf(topicId);
        // Here you could actually go out and fetch the options for a server.
        var myNewOptions = option2Options[key];
        // Now set the options.
        // If you got the results from a server, this would go in the callback
        key = myNewOptions.indexOf(subTopicId);
        return  key;
    };
}















