
adminControllers.controller('AnnouncementCreateController', ['$scope', '$http', '$location', '$route', '$routeParams', '$location', 'AdminDiscuss','MenuTag','$rootScope',
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
	 segment = "P";
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
				$scope.currentDiscuss.promotion = 1;
				$scope.currentDiscuss.systemTags = getSystemTagList($scope.selectedMenuList);
				$scope.currentDiscuss.topicId = $.map($scope.selectedMenuList, function(value, key){
	                return value.id;
	            });

				//putting the userId to discuss being created

	 			$scope.currentDiscuss.$save(function () {
					toastr.success('Edited successfully');
					$location.path('/discuss/Announcements');
	 			});
	 		};
	 	}
	 	//CREATE MODE
	 	else
	 	{
	 		$scope.currentDiscuss = new AdminDiscuss();
	 		$scope.currentDiscuss.discussType = segment;
	 		$scope.currentDiscuss.promotion = 1;
	 		
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
				$scope.currentDiscuss.promotion = 1;
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
					$location.path('/discuss/Announcements');
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


