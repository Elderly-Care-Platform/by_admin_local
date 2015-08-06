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


//Routing and Session Check for Login
byAdminApp.run(function($rootScope, $location, SessionIdService,BYMenu) {

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
    
    var mainMenu = null;
    function createMenuCategoryMap(categories){
        angular.forEach(categories, function(category, index){
            $rootScope.menuCategoryMap[category.id] = category;
            if(category.module === 0){
                if(!category.parentMenuId){
                    $rootScope.discussCategoryMap[category.id] = category;
                } else if(category.parentMenuId){
                    //If menu does not exist in map
                    if(!$rootScope.discussCategoryMap[category.id]){
                        var parentMenu = $rootScope.menuCategoryMap[category.parentMenuId], rootMenu;
                        $rootScope.discussCategoryMap[parentMenu.id] = parentMenu;  //Add parent in map

                        if(parentMenu.parentMenuId){
                            rootMenu = $rootScope.menuCategoryMap[parentMenu.parentMenuId];
                            delete $rootScope.discussCategoryMap[rootMenu.id]; //Delete root from map
                            for(var i=0; i < rootMenu.children.length; i++){
                                var menu = rootMenu.children[i];
                                if(menu.module === 0){
                                    $rootScope.discussCategoryMap[menu.id] = menu;   //Add parent sibling of same module id in map
                                }
                            }
                        }
                    }
                }
            }else if(category.module === 1){  //Services Menus
                //If it is child category then adding first ancestor of the category in the map, if the category is of service module
                if(category.ancestorIds.length > 0){
                    $rootScope.serviceCategoryMap[category.ancestorIds[0]] = $rootScope.menuCategoryMap[category.ancestorIds[0]];
                } else{
                    $rootScope.serviceCategoryMap[category.id] = category;
                }
            }else{
                //yet to decide
            }

            if(category.children.length > 0){
            	createMenuCategoryMap(category.children);
            }
        });
    }
    BYMenu.query({}, function(response){
    	mainMenu = response;

        $rootScope.menuCategoryMap = {};
        $rootScope.discussCategoryMap = {};
        $rootScope.serviceCategoryMap = {};

        createMenuCategoryMap(response);

        console.log($rootScope.discussCategoryMap);

    }, function(error){

    })

    
    
    
});

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




adminControllers.controller('AdminDiscussCreateController', ['$scope', '$http', '$location', '$route', '$routeParams', '$location', 'AdminDiscuss','MenuTag','$rootScope',
  function($scope, $http, $location, $route, $routeParams, $location, AdminDiscuss,MenuTag,$rootScope) {
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
	 
	 $scope.selectedMenuList = {};
	 
	 $scope.selectTag = function(event, category){
         if(event.target.checked){
             $scope.selectedMenuList[category.id] = category;
             if(category.parentMenuId && $scope.selectedMenuList[category.parentMenuId]){
                 delete $scope.selectedMenuList[category.parentMenuId];
             }
         }else{
             delete $scope.selectedMenuList[category.id];
         }
     }
	 var systemTagList = {};
	 var getSystemTagList = function(data){
         function rec(data){
             angular.forEach(data, function(menu, index){
                 systemTagList[menu.id] = menu.tags;
                 if(menu.ancestorIds.length > 0){
                     for(var j=0; j < menu.ancestorIds.length; j++){
                         var ancestordata = {};
                         ancestordata[menu.ancestorIds[j]] =  $rootScope.menuCategoryMap[menu.ancestorIds[j]];
                         rec(ancestordata);
                     }
                 }
             })
         }

         rec(data);

         return  $.map(systemTagList, function(value, key){
             return value;
         });
     }

	//P or Q or A
	 segment = segment.substring(segment.lastIndexOf('/')+1);
     var discussId = $routeParams.discussId;
		//EDIT MODE
	 	if(discussId != null )
	 	{
	 		$scope.currentDiscuss = AdminDiscuss.get({discussId:discussId},function(){
	 			$scope.currentDiscuss.newArticlePhotoFilename = "";
	 			$scope.currentDiscuss.newArticlePhotoFilename = JSON.stringify($scope.currentDiscuss.articlePhotoFilename);
	 			if($scope.currentDiscuss.topicId){
	 				for(var i=0;i<$scope.currentDiscuss.topicId.length ; i++){
	 					$scope.selectedMenuId = $scope.currentDiscuss.topicId[i];
		 	            $scope.selectedMenuList[$scope.selectedMenuId] = $rootScope.menuCategoryMap[$scope.selectedMenuId];
	 				}
	 	            
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
				$scope.currentDiscuss.systemTags = getSystemTagList($scope.selectedMenuList);
				$scope.currentDiscuss.topicId = $.map($scope.selectedMenuList, function(value, key){
	                return value.id;
	            });

				//putting the userId to discuss being created

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
				$scope.currentDiscuss.userId = localStorage.getItem("ADMIN_USER_ID");
				$scope.currentDiscuss.username = localStorage.getItem("ADMIN_USER_NAME");
				
				$scope.currentDiscuss.status = $scope.currentDiscuss.status === true ? 1:0;
				$scope.currentDiscuss.featured = $scope.currentDiscuss.featured === true ? 1:0;
				if($scope.newArticlePhotoFilename){
					$scope.currentDiscuss.articlePhotoFilename = JSON.parse($scope.newArticlePhotoFilename);
				}
				$scope.currentDiscuss.systemTags = getSystemTagList($scope.selectedMenuList);
				$scope.currentDiscuss.topicId = $.map($scope.selectedMenuList, function(value, key){
	                return value.id;
	            });
				

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
