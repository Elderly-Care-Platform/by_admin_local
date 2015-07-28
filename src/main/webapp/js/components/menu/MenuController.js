adminControllers.controller('MenuController', [
		'$scope',
		'$routeParams',
		'$location',
		'AdminUser',
		function($scope, $routeParams, $location, AdminUser) {
			if (localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER'
					|| localStorage.getItem("ADMIN_USER_ROLE") == 'USER'
					|| localStorage.getItem("ADMIN_USER_ROLE") == ''
					|| localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR') {
				return;
			}

		} ]);

adminControllers.controller('TagCreateController', [
		'$scope',
		'$routeParams',
		'$location',
		'AdminUser',
		'MenuTag',
		function($scope, $routeParams, $location, AdminUser, MenuTag) {
			if (localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER'
					|| localStorage.getItem("ADMIN_USER_ROLE") == 'USER'
					|| localStorage.getItem("ADMIN_USER_ROLE") == ''
					|| localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR') {
				return;
			}

			$scope.newTag = {};
			$scope.newTag.name = "";
			$scope.newTag.description = "";

			$scope.addTag = function() {
				var tagResource = new MenuTag();
				tagResource.name = $scope.newTag.name;
				tagResource.description = $scope.newTag.description;
				tagResource.$save(function() {
					location.href = "#/menu";
				}, function(e) {
					console.log(e);
					alert("error");
				})

			}
		} ]);

adminControllers.controller('MenuCreateController', [
		'$scope',
		'$http',
		'$routeParams',
		'$location',
		'AdminUser',
		'Menu',
		'MenuTag',
		function($scope, $http, $routeParams, $location, AdminUser, Menu,
				MenuTag) {

			MenuTag.get(function(res) {
				$scope.existingTags = res;
			}, function() {
				alert("error fetching tags");
			});

			$http.get("api/v1/menu/getAllMenu").success(function(response) {
				$scope.existingMenus = response;
			}, function(err) {
				alert("error fetching menus");
			});

			if (localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER'
					|| localStorage.getItem("ADMIN_USER_ROLE") == 'USER'
					|| localStorage.getItem("ADMIN_USER_ROLE") == ''
					|| localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR') {
				return;
			}

			$scope.errorMessage = "";
			$scope.selectedTag = "";

			$scope.newMenu = {};
			$scope.parentMenu = {displayMenuName: ""};
			$scope.linkedMenu = {displayMenuName: ""};

			$scope.addMenu = function() {
				$scope.error = false;
				var menuResource = new Menu();
				menuResource.displayMenuName = $scope.newMenu.displayMenuName;
				menuResource.tags = [ $scope.selectedTag ];
				menuResource.module = $scope.newMenu.module;
				menuResource.linkedMenuId = ($scope.linkedMenu && $scope.linkedMenu.id) ? $scope.linkedMenu.id : null;
				menuResource.displayMenuName = $scope.newMenu.displayMenuName;
				menuResource.parentMenuId = ($scope.parentMenu && $scope.parentMenu.id) ? $scope.parentMenu.id : null;
				menuResource.filterName = $scope.newMenu.filterName;

				if (!$scope.selectedTag || !$scope.selectedTag.id) {
					$scope.error = true;
					$scope.errorMessage = "please select a valid tag";
				}else if(menuResource.parentMenu && !menuResource.parentMenu.id){
					$scope.error = true;
					$scope.errorMessage = "please select a valid parent menu";
				}else if($scope.newMenu.module == undefined){
					$scope.error = true;
					$scope.errorMessage = "please select a module for this menu";
				}else if(!$scope.newMenu.displayMenuName){
					$scope.error = true;
					$scope.errorMessage = "please entter a display name";
				}else{
					menuResource.$save(function() {
						location.href = "#/menu";
					}, function(e) {
						console.log(e);
						alert("error");
					});
				}
				
				function resetObjeccts(){
					$scope.parentMenu = "";
					$scope.linkedMenu = "";
					$scope.selectedTag = "";
				}

			}
		} ]);