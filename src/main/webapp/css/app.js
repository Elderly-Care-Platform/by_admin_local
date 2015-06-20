var adminServices = angular.module("adminServices", ["ngResource"]);
var adminControllers = angular.module("adminControllers", []);




var post = adminServices.factory('SessionIdService', function() {
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
		//update: {method: 'PUT', params: {userId: '@id'}}
		get: {method: 'GET', params: {userId: '@id'}}
	})
});

var userByFilter_admin = adminServices.factory('AdminUserList', function($resource) {
	return $resource('/byadmin/api/v1/users/list/all',{}, {

	})
});


//Post - admin
var post_admin = adminServices.factory('AdminPost', function($resource) {
	return $resource('/byadmin/api/v1/posts/:postId',{}, {
		remove:{method: 'DELETE', params: {postId: '@id'}},
		update:{method: 'PUT', params: {postId: '@id'}},
		get: {method: 'GET', params: {postId: '@id'}}
	})
});
var postByFilterQuestion_admin = adminServices.factory('AdminQuestionPost', function($resource) {
	return $resource('/byadmin/api/v1/posts/list/1',{}, {
		//query: {method: 'GET'} //not needed - will use the default
	})
});

var postByFilterArticle_admin = adminServices.factory('AdminArticlePost', function($resource) {
	return $resource('/byadmin/api/v1/posts/list/2',{}, {
		//query: {method: 'GET'} - not needed will use the default
	})
});

var postShow_admin = adminServices.factory('AdminPostShow', function($resource) {
	return $resource('/byadmin/api/v1/posts/show/:postId',{}, {
		show: {method: 'GET', params: {postId: '@id'}},
		get: {method: 'GET', params: {postId: '@id'}}
	})
});



var byAdminApp = angular.module('byAdminApp', [
 	"adminControllers",
 	"adminServices"
 ]);




byAdminApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/users/all', {templateUrl: 'views/users/list.html', controller: 'AdminUserListController'})
    .when('/users/new', {templateUrl: 'views/users/create.html', controller: 'AdminUserCreateController'})
    .when('/users/showedit/:userId', {templateUrl: 'views/users/edit.html', controller: 'AdminUserEditController'})
    .when('/users/showedit/:userId', {templateUrl: 'views/users/edit.html', controller: 'AdminUserCreateController'})
    .when('/users/delete/:userId', {templateUrl: 'views/users/list.html', controller: 'AdminUserDeleteController'})
    .when('/users/login', {templateUrl: 'views/users/login.html', controller: 'AdminLoginController'})
    .when('/users/logout/:sessionId', {templateUrl: 'views/users/login.html', controller: 'AdminLogoutController'})
    .when('/posts/all', {templateUrl: 'views/posts/list.html', controller: 'AdminPostListController'})
      .when('/posts/1', {templateUrl: 'views/posts/list.html', controller: 'AdminListQuestionController'})
      .when('/posts/2', {templateUrl: 'views/posts/list.html', controller: 'AdminListArticleController'})
	  .when('/posts/new', {templateUrl: 'views/posts/create.html', controller: 'AdminPostCreateController'})
	  .when('/posts/showedit/:postId', {templateUrl: 'views/posts/edit.html', controller: 'AdminPostCreateController'})
	  .when('/posts/edit/:postId', {templateUrl: 'views/posts/list.html', controller: 'AdminPostCreateController'})
	  .when('/posts/delete/:postId', {templateUrl: 'views/posts/list.html', controller: 'AdminPostDeleteController'})
      .when('/posts/:postId', {templateUrl: 'views/posts/detail.html', controller: 'AdminPostDetailController'});
    $routeProvider.otherwise({redirectTo: 'views/users/list.html'});
  }]);


//Routing and Session Check for Login
byAdminApp.run(function($rootScope, $location, SessionIdService) {

    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function(event, next, current) {

        console.log("Routechanged... ");

       	var session = SessionIdService.getSessionId();
       	//alert(session);
       	//var session = SessionIdService.sessionId;
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
	 			$scope.user.$save(function (user, headers) {
	 				toastr.success("Submitted New User");
	 				$location.path('/users/all');
	 			});
	 		};
		}
  }]);


//User Edit
adminControllers.controller('AdminUserEditController', ['$scope', '$routeParams', '$location', 'AdminUserShow',
  function($scope, $routeParams, $location, AdminUserShow) {
	var userId = $routeParams.userId;
    $scope.user = AdminUserShow.get({userId: userId});
	/*$scope.edituser = function () {
		$scope.user.$save(function (user, headers) {
			toastr.success("Edited User");
			$location.path('/users/all');
		});
	};
	*/

  }]);



//User Delete
adminControllers.controller('AdminUserDeleteController', ['$scope', '$routeParams', '$location', 'AdminUser',
  function($scope, $routeParams, $location, AdminUser) {
    var userId = $routeParams.userId;
	$scope.user = AdminUser.remove({userId: userId});
	$scope.users = AdminUser.query();
	$location.path('/users/all');
	toastr.success("Deleted User");
  }]);


//User Listing
adminControllers.controller('AdminUserListController', ['$scope', 'AdminUserList',
	function($scope, AdminUserList) {
	   $scope.users = AdminUserList.query();
	}]);



adminControllers.controller('AdminLoginController', ['$scope', '$http', '$location', '$rootScope',
   function ($scope, $http, $location, $rootScope) {
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

   			if ("localStorage" in window)
   			{
				localStorage.setItem("SessionId", login.sessionId);
               	$location.path("/users/all");
   			}
   			else
   			{
				$scope.setError('Browser does not support cookies');
   				$location.path("/users/login");
   			}


           }).error(function() {
               $scope.setError('Invalid user/password combination');
           });
       }

       $scope.resetError = function() {
           $scope.error = false;
           $scope.errorMessage = '';
       }

       $scope.setError = function(message) {
           $scope.error = true;
           $scope.errorMessage = message;
           $rootScope.SessionId='';
       }
   }]);


//POSTS

adminControllers.controller('AdminPostListController', ['$scope', 'AdminPost',
  function($scope, AdminPost) {
     $scope.posts = AdminPost.query();
  }]);

adminControllers.controller('AdminListQuestionController', ['$scope', '$location', 'AdminQuestionPost',
function($scope, $location, AdminQuestionPost) {
	$scope.posts = AdminQuestionPost.query();
	$location.path('/posts/1');
}]);

adminControllers.controller('AdminListArticleController', ['$scope', '$location', 'AdminArticlePost',
function($scope, $location, AdminArticlePost) {
	$scope.posts = AdminArticlePost.query();
	$location.path('/posts/2');
}]);



adminControllers.controller('AdminPostCreateController', ['$scope', '$routeParams', '$location', 'AdminPost',
  function($scope, $routeParams, $location, AdminPost) {
     var postId = $routeParams.postId;
	 	if(postId != null )
	 	{
	 		$scope.post = AdminPost.get({postId: postId});

	 		///////hardcoded assignment to the tinymce control works like below.
	 		//tinyMCE.get('text').setContent('hello world!');

	 		$scope.editpost = function () {
	 			var htmlval = tinyMCE.get('text').getContent();
	 			$scope.post.text=htmlval;

	 			$scope.post.$save(function (post, headers) {
	 				toastr.success("Edited Post");
	 				$location.path('/posts/2');
	 			});
	 		};
	 	}
	 	else
	 	{
	 		$scope.post = new AdminPost();

	 		$scope.save = function () {
	 			var htmlval = tinyMCE.get('text').getContent();
	 			$scope.post.text=htmlval;
	 			$scope.post.$save(function (post, headers) {
	 				toastr.success("Submitted New Post");
	 				$location.path('/posts/2');
	 			});
	 		};
	}
  }]);


adminControllers.controller('AdminPostEditController', ['$scope', '$routeParams', '$location', 'AdminPostShow',
  function($scope, $routeParams, $location, AdminPostShow) {
	var postId = $routeParams.postId;
	$scope.post = AdminPostShow.show({postId: postId});
    //??????tinyMCE.setContent($scope.post.text);

	tinyMCE.activeEditor.setContent($scope.post.text, {format : 'raw'});

  }]);

adminControllers.controller('AdminPostDetailController', ['$scope', '$routeParams', 'AdminPostShow',
  function($scope, $routeParams, AdminPostShow) {
     var postId = $routeParams.postId;

    $scope.post = AdminPostShow.show({postId: postId});

  }]);


adminControllers.controller('AdminPostDeleteController', ['$scope', '$routeParams', '$location', 'AdminPost',
  function($scope, $routeParams, $location, AdminPost) {
     var postId = $routeParams.postId;

	$scope.post = AdminPost.remove({postId: postId});
	$scope.posts = AdminPost.query();
	$location.path('/posts/2');
	toastr.success("Deleted Post");
  }]);



var UserTypeController = function($scope) {

    $scope.userAccountTypes =
    [
        "User",
        "Writer",
        "Editor"
    ];
};
