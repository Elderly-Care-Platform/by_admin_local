var adminServices = angular.module("adminServices", ["ngResource"]);
var adminControllers = angular.module("adminControllers", ['ui.bootstrap', "jqwidgets", 'datatables', 'ngResource']);
var discuss = adminServices.factory('SessionIdService', function () {
    var sessionID = '';
    return {
        getSessionId: function () {
            if (sessionID == '' || sessionID == null) {
                if ("localStorage" in window) {
                    sessionID = localStorage.getItem("AdminSessionId");
                }
                else {
                    alert("No local storage");
                }
            }

            return sessionID;
        },

        setSessionId: function (sessId) {
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
byAdminApp.run(function ($rootScope, $location, SessionIdService, BYMenu, $http) {
    $http.defaults.headers.common.sess = localStorage.getItem("AdminSessionId");
    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function (event, next, current) {

        console.log("Routechanged... ");
        BYAdmin.removeEditor();
        var session = SessionIdService.getSessionId();
        if (session == '' || session == null) {

            // no logged user, we should be going to #login
            if (next.templateUrl == "views/users/login.html") {
            } else {
                $location.path("/users/login");
            }
        }
    });

    var mainMenu = null;

    $rootScope.menuCategoryMapByName = {};

    function createMenuCategoryMap(categories) {
        angular.forEach(categories, function (category, index) {
            $rootScope.menuCategoryMap[category.id] = category;
            if (category.module === 0) {
                if (!category.parentMenuId) {
                    $rootScope.discussCategoryMap[category.id] = category;
                } else if (category.parentMenuId) {
                    //If menu does not exist in map
                    if (!$rootScope.discussCategoryMap[category.id]) {
                        var parentMenu = $rootScope.menuCategoryMap[category.parentMenuId], rootMenu;
                        $rootScope.discussCategoryMap[parentMenu.id] = parentMenu;  //Add parent in map

                        if (parentMenu.parentMenuId) {
                            rootMenu = $rootScope.menuCategoryMap[parentMenu.parentMenuId];
                            delete $rootScope.discussCategoryMap[rootMenu.id]; //Delete root from map
                            for (var i = 0; i < rootMenu.children.length; i++) {
                                var menu = rootMenu.children[i];
                                if (menu.module === 0) {
                                    $rootScope.discussCategoryMap[menu.id] = menu;   //Add parent sibling of same module id in map
                                }
                            }
                        }
                    }
                }
            } else if (category.module === 1) {  

            //Services Menus
                //If it is child category then adding first ancestor of the category in the map, if the category is of service module
                if (category.ancestorIds.length > 0) {
                    $rootScope.serviceCategoryMap[category.ancestorIds[0]] = $rootScope.menuCategoryMap[category.ancestorIds[0]];
                } else {
                    $rootScope.serviceCategoryMap[category.id] = category;
                }
            } else {
                //yet to decide
            }

            if (category.children.length > 0) {
                createMenuCategoryMap(category.children);
            }


            $rootScope.menuCategoryMapByName[category.displayMenuName] = category;
        });
    }

    BYMenu.query({}, function (response) {
        mainMenu = response.data;
        $rootScope.mainMenu = response.data;
        $rootScope.menuCategoryMap = {};
        $rootScope.discussCategoryMap = {};
        $rootScope.serviceCategoryMap = {};

        createMenuCategoryMap(mainMenu);

    }, function (errorResponse) {
        if (errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002) {
            $location.path('/users/login');
            return;
        }
    })


});

//DISCUSS

adminControllers.controller('AdminDiscussListController', ['$scope', '$location', 'AdminDiscussList',
    function ($scope, $location, AdminDiscussList) {
        if (localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '') {

            $location.path('/users/login');
            return;
        }
        AdminDiscussList.query({}, function (res) {
            $scope.discuss = res.data;
        }, function (errorResponse) {
            if (errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002) {
                $location.path('/users/login');
                return;
            }
        });
    }]);


/////////////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////
//Answer and comments
adminControllers.controller('CommentListController', ['$scope', '$location', 'AdminCommentList',
    function ($scope, $location, AdminCommentList) {
        if (localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '') {

            $location.path('/users/login');
            return;
        }
        var discussId = $location.path().substring($location.path().lastIndexOf('/') + 1);
        //???????$scope.comment = AdminCommentList.query({parentId:discussId,ancestorId:discussId});

    }]);

adminControllers.controller('AdminCommentCreateController', ['$scope', '$http', '$route', '$routeParams', '$location', 'AdminComment',
    function ($scope, $http, $route, $routeParams, $location, AdminComment) {
        $scope.currentComment = '';
        $scope.currentCommentResource = '';
        if (localStorage.getItem("AdminSessionId") == '') {
            $location.path('/users/login');
            return;
        }
        if (localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '') {
            $location.path('/users/login');
            return;
        }
        var segment = $location.path();

        //P or Q or A
        segment = segment.substring(segment.lastIndexOf('/') + 1);
        var commentId = $routeParams.commentId;

        //EDIT MODE
        if (commentId != null) {

            AdminComment.get({commentId: commentId}, function (res) {
                $scope.currentComment = res.data;
            }, function (errorResponse) {
                if (errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002) {
                    $location.path('/users/login');
                    return;
                }
            });

            $scope.editcomment = function () {

                //putting the userId to discuss being created
                $scope.currentComment.userId = localStorage.getItem("ADMIN_USER_ID");
                $scope.currentComment.userName = localStorage.getItem("ADMIN_USER_NAME");

                $scope.currentComment.status = $scope.currentComment.status === true ? 1 : 0;

                AdminComment.update($scope.currentComment, function () {
                    toastr.success('Comment edited successfully');
                    $location.path('/comment/' + $scope.currentComment.discussId + '/' + ($scope.currentComment.parentReplyId || "null"));
                }, function (errorResponse) {
                    if (errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002) {
                        $location.path('/users/login');
                        return;
                    }
                })
//	 			$scope.currentComment.$save(function () {
//					toastr.success('Comment edited successfully');
//					$location.path('/comment/'+ $scope.currentComment.discussId + '/' + ($scope.currentComment.parentReplyId||"null"));
//	 			},
//	 			function(errorResponse){
//	 				if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
//	 					$location.path('/users/login');
//	 					 return;
//	 		        }
//	 			});
            };

            $scope.goBack = function () {

                $location.path('/comment/' + $scope.currentComment.discussId + '/' + ($scope.currentComment.parentReplyId || "null"));
            };

            $location.path('/comment/' + commentId);

        }
    }]);

/////////////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////


adminControllers.controller('AdminListQuestionController', ['$scope', '$rootScope', '$location', 'AdminQuestionDiscuss',
    function ($scope,  $rootScope, $location, AdminQuestionDiscuss) {
        if (localStorage.getItem("AdminSessionId") == '') {
            $location.path('/users/login');
            return;
        }
        if (localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '') {
            return;
        }
        AdminQuestionDiscuss.query({}, function (res) {
            $scope.discuss = res.data;
            $scope.discuss.discussType = 'Q';
            $rootScope.bc_discussType = 'Q';
        }, function (errorResponse) {
            if (errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002) {
                $location.path('/users/login');
                return;
            }
        });
        $location.path('/discuss/Q');
    }]);

adminControllers.controller('AdminListPostController', ['$scope', '$rootScope', '$location', 'AdminPostDiscuss',
    function ($scope, $rootScope, $location, AdminPostDiscuss) {
        if (localStorage.getItem("AdminSessionId") == '') {
            $location.path('/users/login');
            return;
        }
        if (localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '') {
            $location.path('/users/login');
            return;
        }
        AdminPostDiscuss.query({}, function (res) {
            $scope.discuss = res.data;
            $scope.discuss.discussType = 'P';
            $rootScope.bc_discussType = 'P';
        }, function (errorResponse) {
            if (errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002) {
                $location.path('/users/login');
                return;
            }
        });

        $location.path('/discuss/P');
    }]);

adminControllers.controller('AdminListFeedbackController', ['$scope', '$rootScope', '$location', 'AdminFeedbackDiscuss',
    function ($scope, $rootScope, $location, AdminFeedbackDiscuss) {
        if (localStorage.getItem("AdminSessionId") == '') {
            return;
        }
        AdminFeedbackDiscuss.query({}, function (res) {
            $scope.discuss = res.data;
            $scope.discuss.discussType = 'F';
            $rootScope.bc_discussType = 'F';
        }, function (errorResponse) {
            if (errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002) {
                $location.path('/users/login');
                return;
            }
        });

        $location.path('/discuss/F');
    }]);

adminControllers.controller('AdminListArticleController', ['$scope', '$rootScope', '$location', 'AdminArticleDiscuss',
    function ($scope, $rootScope, $location, AdminArticleDiscuss) {
        if (localStorage.getItem("AdminSessionId") == '') {
            $location.path('/users/login');
            return;
        }
        if (localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '') {
            $location.path('/users/login');
            return;
        }
        AdminArticleDiscuss.query(function (res) {
            $scope.discuss = res.data;
            $scope.discuss.discussType = 'A';
            $rootScope.bc_discussType = 'A';
        }, function (errorResponse) {
            if (errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002) {
                $location.path('/users/login');
                return;
            }
        });

        $location.path('/discuss/A');
    }]);


adminControllers.controller('LoadTMController', ['$scope', '$route',
    function ($scope, $route) {
        tinymce.init({
            selector: "textarea",
            theme: "modern",
            skin: 'light',
            content_css: "css/tinyMce_custom.css",
            statusbar: false,
            menubar: false,
            plugins: [
                "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
                "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                " emoticons textcolor paste autoresize "
            ],
            toolbar: "styleselect | bold italic | bullist numlist hr  | undo redo | link unlink emoticons image media  preview ",
            setup: function (ed) {
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

                ed.on('blur', function (e) {
                    console.log('reset event', e);
                });

                ed.on('remove', function (e) {
                    console.log('remove event', e);
                });
            }
        });


    }
]);


adminControllers.controller('AdminDiscussCreateController', ['$scope', '$http', '$route', '$routeParams', '$location', 'AdminDiscuss', 'MenuTag', '$rootScope',
    function ($scope, $http, $route, $routeParams, $location, AdminDiscuss, MenuTag, $rootScope) {
        if (localStorage.getItem("AdminSessionId") == '') {
            $location.path('/users/login');
            return;
        }
        if (localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '') {
            $location.path('/users/login');
            return;
        }
        
        $scope.copyDate = function(copiedFrom){
        	var timeStamp = "";
        	if(copiedFrom == "createAt"){
        		timeStamp = $scope.currentDiscuss.createdAt;
        	}else if(copiedFrom == "now"){
        		timeStamp = (new Date()).getTime();
        	}
        	
        	$scope.modifiedDate = getDateObject(timeStamp);
        }
        
        function getDateObject(timestamp){
        	var ret = {
        			"y":"",
        			"m":"",
        			"d":"",
        			"h":"",
        			"mi":"",
        			"s":"",
        			"ms":""
        	}
        	var date = new Date(Number(timestamp));
        	ret.y = date.getFullYear();
        	ret.m = date.getMonth() + 1;
        	ret.d = date.getDate();
        	ret.h = date.getHours();
        	ret.mi = date.getMinutes();
        	ret.s = date.getSeconds();
        	ret.ms = date.getMilliseconds();
        	return ret;
        }
        
        function getTimeStamp(dateObj){
        	var date = new Date(dateObj.y,dateObj.m - 1,dateObj.d,dateObj.h,dateObj.mi,dateObj.s,dateObj.ms);
        	return date.getTime();
        }

        var segment = $location.path();

        $scope.selectedMenuList = {};
        var selectParentHierArchy = function (category) {
            if (category.ancestorIds.length > 0) {
                for (var i = 0; i < category.ancestorIds.length; i++) {
                    if (!$scope.selectedMenuList[category.ancestorIds[i]]) {
                        $scope.selectedMenuList[category.ancestorIds[i]] = $rootScope.menuCategoryMap[category.ancestorIds[i]];
                    }
                }
            }
        };

        $scope.selectTag = function (event, category) {
            if (event.target.checked) {
                $scope.selectedMenuList[category.id] = category;
                selectParentHierArchy(category);
            } else {
                delete $scope.selectedMenuList[category.id];
            }
        }

        var systemTagList = {};
        var getSystemTagList = function (data) {
            /**function to include all parent tags into discuss system tags**/
            function selectAllParentTags(data) {
                angular.forEach(data, function (menu, index) {
                    systemTagList[menu.id] = menu.tags;
                    if (menu.ancestorIds.length > 0) {
                        for (var j = 0; j < menu.ancestorIds.length; j++) {
                            var ancestordata = {};
                            ancestordata[menu.ancestorIds[j]] = $rootScope.menuCategoryMap[menu.ancestorIds[j]];
                            selectAllParentTags(ancestordata);
                        }
                    }
                })
            }

            /**function to include selected menu tags into discuss system tags**/
            function selectedMenuTags(data){
                angular.forEach(data, function (menu, index) {
                    systemTagList[menu.id] = menu.tags;
                })
            }

            /**If selectedMenuList does not include parent hierarchy then add all parent tags**/
            //selectAllParentTags(data);

            /**If selectedMenuList already included parent hierarchy then add selected menu tags**/
            selectedMenuTags(data);


            return $.map(systemTagList, function (value, key) {
                return value;
            });
        }

        //P or Q or A
        segment = segment.substring(segment.lastIndexOf('/') + 1);
        var discussId = $routeParams.discussId;
        //EDIT MODE
        if (discussId != null) {
            AdminDiscuss.get({discussId: discussId}, function (res) {
                $scope.currentDiscuss = res.data;
                $scope.modifiedDate = getDateObject(res.data.lastModifiedAt);
                $scope.currentDiscuss.newArticlePhotoFilename = "";
                $scope.currentDiscuss.newArticlePhotoFilename = JSON.stringify($scope.currentDiscuss.articlePhotoFilename);
                if ($scope.currentDiscuss.topicId) {
                    for (var i = 0; i < $scope.currentDiscuss.topicId.length; i++) {
                        $scope.selectedMenuId = $scope.currentDiscuss.topicId[i];
                        var menu = $rootScope.menuCategoryMap[$scope.selectedMenuId];
                        if(menu){
                            if(!$scope.selectedMenuList[$scope.selectedMenuId]){
                                $scope.selectedMenuList[$scope.selectedMenuId] = menu;
                            }
                        }
                    }
                }
            }, function (errorResponse) {
                if (errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002) {
                    $location.path('/users/login');
                    return;
                }
            });
            $scope.editdiscuss = function () {
                var htmlval = tinyMCE.activeEditor.getContent();
                $scope.currentDiscuss.articlePhotoFilename = JSON.parse($scope.currentDiscuss.newArticlePhotoFilename);
                if (htmlval == '') {

                    htmlval = document.getElementById('texta').value;

                }

                $scope.currentDiscuss.lastModifiedAt = getTimeStamp($scope.modifiedDate);
                $scope.currentDiscuss.text = htmlval;
                $scope.currentDiscuss.status = $scope.currentDiscuss.status === true ? 1 : 0;
                $scope.currentDiscuss.featured = $scope.currentDiscuss.featured === true ? 1 : 0;
                $scope.currentDiscuss.promotion = $scope.currentDiscuss.promotion === true ? 1 : 0;
                $scope.currentDiscuss.systemTags = getSystemTagList($scope.selectedMenuList);
                $scope.currentDiscuss.topicId = $.map($scope.selectedMenuList, function (value, key) {
                    return value.id;
                });

                //putting the userId to discuss being created

                AdminDiscuss.update($scope.currentDiscuss, function () {
                        toastr.success('Edited successfully');
                        var location = $scope.currentDiscuss.discussType;
                        $location.path('/discuss/' + location);
                    },
                    function (errorResponse) {
                        if (errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002) {
                            $location.path('/users/login');
                            return;
                        }
                    });
//	 			$scope.currentDiscuss.$save(function () {
//					toastr.success('Edited successfully');
//					var location = $scope.currentDiscuss.discussType;
//					$location.path('/discuss/' + location);
//	 			},
//	 			function(errorResponse){
//	 				if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
//	 					$location.path('/users/login');
//	 					 return;
//	 		        }
//	 			});
            };
        }
        //CREATE MODE
        else {
            $scope.currentDiscuss = new AdminDiscuss();
            $scope.currentDiscuss.discussType = segment;

            $scope.register = function () {
                var htmlval = tinymce.activeEditor.getContent();
                if (htmlval == '') {
                    htmlval = document.getElementById('text').val;
                }

                $scope.currentDiscuss.text = htmlval;

                //putting the userId to discuss being created
                $scope.currentDiscuss.userId = localStorage.getItem("ADMIN_USER_ID");
                $scope.currentDiscuss.username = localStorage.getItem("ADMIN_USER_NAME");

                $scope.currentDiscuss.status = $scope.currentDiscuss.status === true ? 1 : 0;
                $scope.currentDiscuss.featured = $scope.currentDiscuss.featured === true ? 1 : 0;
                $scope.currentDiscuss.promotion = $scope.currentDiscuss.promotion === true ? 1 : 0;
                if ($scope.newArticlePhotoFilename) {
                    $scope.currentDiscuss.articlePhotoFilename = JSON.parse($scope.newArticlePhotoFilename);
                }
                $scope.currentDiscuss.systemTags = getSystemTagList($scope.selectedMenuList);
                $scope.currentDiscuss.topicId = $.map($scope.selectedMenuList, function (value, key) {
                    return value.id;
                });


                //save the discuss

                AdminDiscuss.update($scope.currentDiscuss, function () {
                        toastr.success('Created successfully');
                        var location = $scope.currentDiscuss.discussType;
                        $location.path('/discuss/' + location);
                    },
                    function (errorResponse) {
                        if (errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002) {
                            $location.path('/users/login');
                            return;
                        }
                    });

//				$scope.currentDiscuss.$save(function () {
//					toastr.success('Created successfully');
//					var location = $scope.currentDiscuss.discussType;
//					$location.path('/discuss/' + location);
//				},
//				function(errorResponse){
//					if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
//						$location.path('/users/login');
//						 return;
//			        }
//				});

            };
        }//else
    }]);


adminControllers.controller('AdminDiscussEditController', ['$scope', '$routeParams', '$location', 'AdminDiscussShow',
    function ($scope, $routeParams, $location, AdminDiscussShow) {
        if (localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '') {
            $location.path('/users/login');
            return;
        }
        var discussId = $routeParams.discussId;
        AdminDiscussShow.show({discussId: discussId}, function (res) {
            $scope.discuss = res.data;
        }, function (errorResponse) {
            if (errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002) {
                $location.path('/users/login');
                return;
            }
        });
        tinyMCE.activeEditor.setContent($scope.discuss.text, {format: 'raw'});

    }]);

adminControllers.controller('AdminDiscussDetailController', ['$scope', '$routeParams', '$location', 'AdminDiscussShow',
    function ($scope, $routeParams, $location, AdminDiscussShow) {
        if (localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '') {
            $location.path('/users/login');
            return;
        }
        var discussId = $routeParams.discussId;
        AdminDiscussShow.show({discussId: discussId}, function (res) {
            $scope.discuss = res.data;
        }, function (errorResponse) {
            if (errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002) {
                $location.path('/users/login');
                return;
            }
        });
    }]);


adminControllers.controller('AdminDiscussDeleteController', ['$scope', '$rootScope', '$routeParams', '$location', 'AdminDiscuss',
    function ($scope, $rootScope, $routeParams, $location, AdminDiscuss) {
        if (localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER' || localStorage.getItem("ADMIN_USER_ROLE") == 'USER' || localStorage.getItem("ADMIN_USER_ROLE") == '') {
            $location.path('/users/login');
            return;
        }
        var discussId = $routeParams.discussId;
        AdminDiscuss.get({discussId: discussId}, function (res) {
            $scope.discuss = res.data;
        }, function (errorResponse) {
            if (errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002) {
                $location.path('/users/login');
                return;
            }
        });

        var loc = $rootScope.bc_discussType;

        AdminDiscuss.remove({discussId: discussId}, function (res) {
            $scope.discuss = res.data;
        }, function (errorResponse) {
            if (errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002) {
                $location.path('/users/login');
                return;
            }
        });

        toastr.success('Deleted successfully');

        //TODO - thsi is not working - not redirecting after a delete - so hard-codng t to Show Articles NOW
        $location.path('/discuss/' + loc);
    }]);
