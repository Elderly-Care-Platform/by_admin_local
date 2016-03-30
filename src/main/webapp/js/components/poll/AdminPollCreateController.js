adminControllers.controller('AdminPollCreateController', ['$scope', '$http', '$route', '$routeParams', '$location', 'AdminDiscuss', 'MenuTag', '$rootScope',
    function ($scope, $http, $route, $routeParams, $location, AdminDiscuss, MenuTag, $rootScope) {
        
        $scope.allOptions = [ "" ];
	 		
 		$scope.addOption = function() {
			$scope.allOptions.push("");
		}


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
                $scope.currentDiscuss.articlePhotoFilename = JSON.parse($scope.currentDiscuss.newArticlePhotoFilename);
               

                $scope.currentDiscuss.lastModifiedAt = getTimeStamp($scope.modifiedDate);
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
//              $scope.currentDiscuss.$save(function () {
//                  toastr.success('Edited successfully');
//                  var location = $scope.currentDiscuss.discussType;
//                  $location.path('/discuss/' + location);
//              },
//              function(errorResponse){
//                  if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
//                      $location.path('/users/login');
//                       return;
//                  }
//              });
            };
        }
        //CREATE MODE
        else {
            $scope.currentDiscuss = new AdminDiscuss();
            $scope.currentDiscuss.discussType = 'POLL';
            $scope.currentDiscuss.pollOptions = $scope.allOptions;

            $scope.register = function () {

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

//              $scope.currentDiscuss.$save(function () {
//                  toastr.success('Created successfully');
//                  var location = $scope.currentDiscuss.discussType;
//                  $location.path('/discuss/' + location);
//              },
//              function(errorResponse){
//                  if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
//                      $location.path('/users/login');
//                       return;
//                  }
//              });

            };
        }

    }]);


adminControllers.controller('AdminPollPostController', ['$scope', '$rootScope', '$location', 'AdminPostDiscuss',
    function ($scope, $rootScope, $location, AdminPostDiscuss) {
      
    }]);

