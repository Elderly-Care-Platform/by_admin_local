var adminServices = angular.module("adminServices", ["ngResource"]);
var adminControllers = angular.module("adminControllers", ['ui.bootstrap']);

var discuss = adminServices.factory('SessionIdService', function() {
    var sessionID = '';
    return {
        getSessionId: function() {
            if(sessionID=='' || sessionID==null)
            {
				if ("localStorage" in window)
				{
               		sessionID = localStorage.getItem("AdminSessionId");
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
            localStorage.setItem("AdminSessionId", sessId);
            sessionID = sessId;
            return;
        }
    }
});





var byAdminApp = angular.module('byAdminApp', [
 	"adminControllers",
 	"adminServices",
 	"ngRoute",
 	'ngSanitize'
 ]);


//
//byAdminApp.directive('bindHtmlUnsafe', function( $compile ) {
//    return function( $scope, $element, $attrs ) {
//
//        var compile = function( newHTML ) { // Create re-useable compile function
//            newHTML = $compile(newHTML)($scope); // Compile html
//            $element.html('').append(newHTML); // Clear and append it
//        };
//
//        var htmlName = $attrs.bindHtmlUnsafe; // Get the name of the variable
//                                              // Where the HTML is stored
//
//        $scope.$watch(htmlName, function( newHTML ) { // Watch for changes to
//                                                      // the HTML
//            if(!newHTML) return;
//            compile(newHTML);   // Compile it
//        });
//
//    };
//});


//Routing and Session Check for Login
byAdminApp.run(function($rootScope, $location, SessionIdService,discussCategoryList) {

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
    
    
    
    discussCategoryList.query().$promise.then(
    	    function(categories){
    	    	$rootScope.discussCategoryList = categories;
    	    	$rootScope.discussCategoryListMap = {};
    	    	$rootScope.discussCategoryNameIdMap = {};
    	        angular.forEach(categories, function(category, index){
    	        	$rootScope.discussCategoryListMap[category.id] = category;
    	        	$rootScope.discussCategoryNameIdMap[category.name.toLowerCase()] = category.id;
    	        	angular.forEach(category.children, function(subCategory, index){
	    				$rootScope.discussCategoryListMap[subCategory.id] = subCategory;
	    				$rootScope.discussCategoryNameIdMap[subCategory.name.toLowerCase()] = subCategory.id;
	    			});
    	        });
    	    }
    	);
});




adminControllers.controller('AdminUserCreateController', ['$scope', '$routeParams', '$location', 'AdminUser',
  function($scope, $routeParams, $location, AdminUser) {
	  	if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '' || localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR')
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
	  	if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '' || localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR')
	  			 {
	  				 return;
	 }
	var userId = $routeParams.userId;
    $scope.user = AdminUserShow.get({userId: userId});
  }]);



//User Delete
adminControllers.controller('AdminUserDeleteController', ['$scope', '$routeParams', '$location', 'AdminUser',
  function($scope, $routeParams, $location, AdminUser) {
	  	if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '' || localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR')
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

		if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '' || localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR')
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

	localStorage.setItem("AdminSessionId", "");
	localStorage.setItem("ADMIN_USER_ID", "");
	localStorage.setItem("ADMIN_USER_NAME", "");
	localStorage.setItem("ADMIN_USER_ROLE", "");

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

//DISCUSS

adminControllers.controller('AdminDiscussListController', ['$scope', '$location', 'AdminDiscussList',
  function($scope, $location, AdminDiscussList) {
	  if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '')
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
	 if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '')
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
	 if(localStorage.getItem("AdminSessionId") == '') {
		$location.path('/users/login');
		return;
	 }
	 if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '')
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
				$scope.currentComment.userId = localStorage.getItem("ADMIN_USER_ID");
				$scope.currentComment.userName = localStorage.getItem("ADMIN_USER_NAME");
				
				$scope.currentComment.status = $scope.currentComment.status === true ? 1:0;


	 			$scope.currentComment.$save(function () {
					toastr.success('Comment edited successfully');
					$location.path('/comment/'+ $scope.currentComment.discussId + '/' + ($scope.currentComment.parentReplyId||"null"));
	 			});
	 		};

	 		$scope.goBack = function () {

					$location.path('/comment/'+ $scope.currentComment.discussId + '/' + ($scope.currentComment.parentReplyId||"null"));
	 		};

	 		$location.path('/comment/' + commentId);

	 	}
	 }]);

/////////////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////




adminControllers.controller('AdminListQuestionController', ['$scope', '$location', '$rootScope', '$location', 'AdminQuestionDiscuss',
function($scope, $location, $rootScope, $location, AdminQuestionDiscuss) {
	if(localStorage.getItem("AdminSessionId") == '') {
		$location.path('/users/login');
		return;
	}
	if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '')
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
	if(localStorage.getItem("AdminSessionId") == '') {
		$location.path('/users/login');
		return;
	}
	if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '')
		 {
			 $location.path('/users/login');
			 return;
	 }
	$scope.discuss = AdminPostDiscuss.query();
	$scope.discuss.discussType = 'P';
	$rootScope.bc_discussType = 'P';
	$location.path('/discuss/P');
}]);

adminControllers.controller('AdminListFeedbackController', ['$scope', '$rootScope', '$location', 'AdminFeedbackDiscuss',
function($scope, $rootScope, $location, AdminFeedbackDiscuss) {
	if(localStorage.getItem("AdminSessionId") == '') {
		return;
	}
	$scope.discuss = AdminFeedbackDiscuss.query();
	$scope.discuss.discussType = 'F';
	$rootScope.bc_discussType = 'F';
	$location.path('/discuss/F');
}]);

adminControllers.controller('AdminListArticleController', ['$scope', '$location', '$rootScope', '$location', 'AdminArticleDiscuss',
function($scope, $location, $rootScope, $location, AdminArticleDiscuss) {
	if(localStorage.getItem("AdminSessionId") == '') {
		$location.path('/users/login');
		return;
	}
	if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '')
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
    theme: "modern",
    skin: 'light',
    content_css : "css/tinyMce_custom.css",
    statusbar: false,
    menubar: false,
    plugins: [
              "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
              "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
              " emoticons textcolor paste autoresize "
          ],
          toolbar: "styleselect | bold italic | bullist numlist hr  | undo redo | link unlink emoticons image media  preview ",
          setup : function(ed) {
              var placeholder = $('#' + ed.id).attr('placeholder');
              if (typeof placeholder !== 'undefined' && placeholder !== false) {
                  var is_default = false;
                  ed.on('init', function () {
                      // get the current content
                      var cont = ed.getContent();

                      // If its empty and we have a placeholder set the value
                      if (cont.length === 0) {
                          ed.setContent(placeholder);
                          // Get updated content
                          cont = placeholder;
                      }
                      // convert to plain text and compare strings
                      is_default = (cont == placeholder);

                      // nothing to do
                      if (!is_default) {
                          return;
                      }
                  }).on('keydown', function () {
                      // replace the default content on focus if the same as original placeholder
                      if (is_default) {
                          ed.setContent('');
                          is_default = false;
                      }
                  }).on('blur', function () {
                      if (ed.getContent().length === 0) {
                          ed.setContent(placeholder);
                      }
                  });
              }
              ed.on('init', function (evt) {
                  var toolbar = $(evt.target.editorContainer)
                      .find('>.mce-container-body >.mce-toolbar-grp');
                  var editor = $(evt.target.editorContainer)
                      .find('>.mce-container-body >.mce-edit-area');

                  // switch the order of the elements
                  toolbar.detach().insertAfter(editor);
              });
              ed.on("keyup", function () {
                  var id = ed.id;
                  if ($.trim(ed.getContent({format: 'text'})).length) {
                      $("#" + id).parents(".textarea-label").find(".btn").removeClass("disabled");
                  } else {
                      $("#" + id).parents(".textarea-label").find(".btn").addClass("disabled");
                  }
              });

              ed.on('blur', function(e) {
                  console.log('reset event', e);
              });

              ed.on('remove', function(e) {
                  console.log('remove event', e);
              });
          }
	});
	


	}
]);




adminControllers.controller('AdminDiscussCreateController', ['$scope', '$http', '$location', '$route', '$routeParams', '$location', 'AdminDiscuss',
  function($scope, $http, $location, $route, $routeParams, $location, AdminDiscuss) {
	 if(localStorage.getItem("AdminSessionId") == '') {
		$location.path('/users/login');
		return;
	 }
	 if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '')
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
	 		$scope.currentDiscuss = AdminDiscuss.get({discussId:discussId},function(){
	 			$scope.currentDiscuss.newArticlePhotoFilename = "";
	 			$scope.currentDiscuss.newArticlePhotoFilename = JSON.stringify($scope.currentDiscuss.articlePhotoFilename);
	 			for(var i=0; i<$scope.currentDiscuss.topicId.length; i++){
	 				BY.editorCategoryList.addCategory($scope.currentDiscuss.topicId[i]);	
	 			}
	 		});
	 		$scope.editdiscuss = function () {
	 			var htmlval = tinyMCE.activeEditor.getContent();
	 			$scope.currentDiscuss.articlePhotoFilename = JSON.parse($scope.currentDiscuss.newArticlePhotoFilename);
				if(htmlval == '')
				{

					htmlval = document.getElementById('texta').value;

				}
				

				$scope.currentDiscuss.text=htmlval;
				$scope.currentDiscuss.status = $scope.currentDiscuss.status === true ? 1:0;
				$scope.currentDiscuss.featured = $scope.currentDiscuss.featured === true ? 1:0;
				$scope.currentDiscuss.topicId = BY.editorCategoryList.getCategoryList();

				//putting the userId to discuss being created

	 			$scope.currentDiscuss.$save(function () {
					toastr.success('Edited successfully');
					BY.editorCategoryList.resetCategoryList();
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
				$scope.currentDiscuss.userId = localStorage.getItem("ADMIN_USER_ID");
				$scope.currentDiscuss.username = localStorage.getItem("ADMIN_USER_NAME");
				
				$scope.currentDiscuss.status = $scope.currentDiscuss.status === true ? 1:0;
				$scope.currentDiscuss.featured = $scope.currentDiscuss.featured === true ? 1:0;
				$scope.currentDiscuss.topicId = BY.editorCategoryList.getCategoryList();
				if($scope.newArticlePhotoFilename){
					$scope.currentDiscuss.articlePhotoFilename = JSON.parse($scope.newArticlePhotoFilename);
				}
				

				//save the discuss
				$scope.currentDiscuss.$save(function () {
					toastr.success('Created successfully');
					BY.editorCategoryList.resetCategoryList();
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
	  if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '')
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
	  if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '')
	  	 {
	  		 $location.path('/users/login');
	  		 return;
	 }
     var discussId = $routeParams.discussId;
    $scope.discuss = AdminDiscussShow.show({discussId: discussId});
  }]);


adminControllers.controller('AdminDiscussDeleteController', ['$scope', '$location', '$rootScope', '$routeParams', '$location', 'AdminDiscuss',
  function($scope, $location, $rootScope, $routeParams, $location, AdminDiscuss) {
	  if(localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '')
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



adminControllers.controller('UserRoleController', [ '$scope', function($scope) {
	$scope.userRoleIds = [ "SUPER_USER", "EDITOR", "USER" ];
} ]);

adminControllers.controller('UserStateController', [ '$scope',
		function($scope) {
			$scope.isActives = [ "In-Active", "Active" ];
		} ]);



adminControllers.controller('topicController', ['$scope', '$rootScope', '$routeParams',
                                                             function($scope,  $rootScope, $routeParams) {
	$scope.options1 = $rootScope.discussCategoryList;
	$scope.options2 = {};
	
	$scope.selectedTopicIndex = '';
	$scope.selectedSubTopicIndex = '';
	
	var topicId = [];
	
	
	
	$scope.loadSubCategories = function(){
		topicId = [];
		topicId = [$rootScope.discussCategoryList[$scope.selectedTopicIndex].id];
		$scope.options2 = $rootScope.discussCategoryList[$scope.selectedTopicIndex].children;
		$scope.$parent.currentDiscuss.topicId = topicId;
	}
	
	$scope.subCategoryChanged = function(){
		topicId = [];
		topicId = [$rootScope.discussCategoryList[$scope.selectedTopicIndex].id, $rootScope.discussCategoryList[$scope.selectedTopicIndex].children[$scope.selectedSubTopicIndex].id];
		$scope.$parent.currentDiscuss.topicId = topicId;
	}
}]);

var BY = BY || {};
BY.editorCategoryList = (function(){
    var selectedCategoryList = {};

    return {
        selectCategory:function(selectedInput){
        	var $body = angular.element(document.body);   // 1
            var $rootScope = $body.scope().$root;
            if(selectedInput.checked===true){
                selectedCategoryList[selectedInput.value] = selectedInput.value ;
            }else{
                delete selectedCategoryList[selectedInput.value];
                if($rootScope.discussCategoryListMap[selectedInput.value] && $rootScope.discussCategoryListMap[selectedInput.value].parentId){
                    delete selectedCategoryList[$rootScope.discussCategoryListMap[selectedInput.value].parentId];
                }
            }
        },

        addCategory:function(selectedCategory){
            selectedCategoryList[selectedCategory] = selectedCategory;
        },

        getCategoryList:function(){
            var $body = angular.element(document.body);   // 1
            var $rootScope = $body.scope().$root;
            for(key in selectedCategoryList){
                if($rootScope.discussCategoryListMap[key] && $rootScope.discussCategoryListMap[key].parentId){
                    selectedCategoryList[$rootScope.discussCategoryListMap[key].parentId] = $rootScope.discussCategoryListMap[key].parentId;
                }

            }

            var categoryMap = $.map(selectedCategoryList, function(value, index) {
                return [value];
            });
            return categoryMap;
        },
        resetCategoryList:function(){
            selectedCategoryList = {};
        }

    }
})();












