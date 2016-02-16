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
				$location.path('/users/login');
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
			$scope.newTag.type = 0;

			$scope.addTag = function() {
				var tagResource = new MenuTag();
				tagResource.name = $scope.newTag.name;
				tagResource.description = $scope.newTag.description;
				tagResource.type = $scope.newTag.type;
				tagResource.$save(function() {
					location.href = "#/menu";
				}, function(errorResponse) {
					if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
						$location.path('/users/login');
						 return;
			        }
					$scope.error = true;
					$scope.errorMessage = errorResponse.data.localizedMessage
							|| errorResponse.data.message;
				})

			}
		} ]);

adminControllers
		.controller(
				'MenuCreateController',
				[
						'$scope',
						'$http',
						'$routeParams',
						'$location',
						'AdminUser',
						'Menu',
						'MenuTag',
						function($scope, $http, $routeParams, $location,
								AdminUser, Menu, MenuTag) {

							MenuTag.get(function(res) {
								$scope.existingTags = res.data;
							}, function(errorResponse) {
								if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
									$location.path('/users/login');
									 return;
						        }
								alert("error fetching tags");
							});

							$http.get("api/v1/menu/getMenu").success(
									function(response) {
										$scope.existingMenus = response.data;
									}, function(errorResponse) {
										if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
											$location.path('/users/login');
											 return;
								        }
										alert("error fetching menus");
									});

							if (localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER'
									|| localStorage.getItem("ADMIN_USER_ROLE") == 'USER'
									|| localStorage.getItem("ADMIN_USER_ROLE") == ''
									|| localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR') {
								return;
							}

							$scope.allTags = [ "" ];

							$scope.errorMessage = "";

							$scope.newMenu = {};
							$scope.parentMenu = {
								displayMenuName : ""
							};
							$scope.linkedMenu = {
								displayMenuName : ""
							};

							$scope.addMenu = function() {
								$scope.error = false;
								var menuResource = new Menu();
								menuResource.orderIdx = $scope.newMenu.orderIdx;
								menuResource.hidden = $scope.newMenu.hidden;
								menuResource.displayMenuName = $scope.newMenu.displayMenuName;
								menuResource.tags = $scope.allTags;
								menuResource.module = $scope.newMenu.module;
								menuResource.linkedMenuId = ($scope.linkedMenu && $scope.linkedMenu.id) ? $scope.linkedMenu.id
										: null;
								menuResource.displayMenuName = $scope.newMenu.displayMenuName;
								menuResource.parentMenuId = ($scope.parentMenu && $scope.parentMenu.id) ? $scope.parentMenu.id
										: null;
								menuResource.filterName = $scope.newMenu.filterName;

								if ($scope.allTags || $scope.allTags.length > 0) {
									for (var i = 0; i < $scope.allTags.length; i++) {
										if (!$scope.allTags[i].id) {
											$scope.errorMessage = "please select a valid tag";
											return;
										}
									}

								} else {
									$scope.errorMessage = "please select atleast one tag";
								}
								if ($scope.newMenu.module == undefined) {
									$scope.error = true;
									$scope.errorMessage = "please select a module for this menu";
								} else if (!$scope.newMenu.displayMenuName) {
									$scope.error = true;
									$scope.errorMessage = "please entter a display name";
								} else {
									menuResource
											.$save(
													function() {
														location.href = "#/menu/viewMenu";
													},
													function(errorResponse) {
														if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
															$location.path('/users/login');
															 return;
												        }
														$scope.error = true;
														$scope.errorMessage = errorResponse.data.localizedMessage
																|| errorResponse.data.message;
													});
								}

								function resetObjeccts() {
									$scope.parentMenu = "";
									$scope.linkedMenu = "";
									$scope.selectedTag = "";
								}

							}
							$scope.addTag = function() {
								$scope.allTags.push("");
							}
							$scope.removeTag = function(idx) {
								$scope.allTags.splice(idx, 1);
							}
						} ]);

adminControllers.controller('MenuViewController', [
		'$scope',
		'$http',
		'$routeParams',
		'$location',
		'AdminUser',
		function($scope, $http, $routeParams, $location, AdminUser) {
			if (localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER'
					|| localStorage.getItem("ADMIN_USER_ROLE") == 'USER'
					|| localStorage.getItem("ADMIN_USER_ROLE") == ''
					|| localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR') {
				return;
			}

			$http.get("api/v1/menu/getMenu?parentId=root").success(
					function(res) {
						res = res.data;
						var rootUl = document.getElementById("mainTreeUl");
						createSubMenu(rootUl, res);
						createTree();
					},function(errorResponse){
						if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
							$location.path('/users/login');
							 return;
				        }
					})

			function createSubMenu(container, menu) {
				for (var i = 0; i < menu.length; i++) {
					if (menu[i] && menu[i].id) {
						var mainLi = document.createElement("li");
						var liDiv = document.createElement("div");
						mainLi.appendChild(liDiv);
						var icon = document.createElement("i");
						var title = document.createElement("a");
						liDiv.appendChild(icon);
						liDiv.appendChild(title);
						title.href = "#/menu/editMenu/" + menu[i].id;
						title.innerText = menu[i].orderIdx + " -> "
								+ menu[i].displayMenuName;
						if(menu[i].hidden == true){
							title.innerText += " (Hidden) "
						}
						container.appendChild(mainLi);
						if (menu[i].children.length > 0) {
							var subMenu = document.createElement("ul");
							mainLi.appendChild(subMenu);
							createSubMenu(subMenu, menu[i].children);
						}
					}

				}
			}

			function createTree() {
				$('.tree li').each(function() {
					if ($(this).children('ul').length > 0) {
						$(this).addClass('parent');
					}
				});

				$('.tree li.parent > div > i').click(
						function() {
							$(this).parent().parent().toggleClass('active');
							$(this).parent().parent().children('ul')
									.slideToggle('fast');
						});

				$('#all').click(function() {

					$('.tree li').each(function() {
						$(this).toggleClass('active');
						$(this).children('ul').slideToggle('fast');
					});
				});

				$('.tree li').each(function() {
					$(this).toggleClass('active');
					$(this).children('ul').slideToggle('fast');
				});

			}
			;

		} ]);

adminControllers
		.controller(
				'MenuEditController',
				[
						'$scope',
						'$http',
						'$routeParams',
						'$location',
						'AdminUser',
						'Menu',
						'MenuTag',
						function($scope, $http, $routeParams, $location,
								AdminUser, Menu, MenuTag) {
							if (localStorage.getItem("ADMIN_USER_ROLE") == 'WRITER'
									|| localStorage.getItem("ADMIN_USER_ROLE") == 'USER'
									|| localStorage.getItem("ADMIN_USER_ROLE") == ''
									|| localStorage.getItem("ADMIN_USER_ROLE") == 'EDITOR') {
								return;
							}

							MenuTag.get(function(res) {
								$scope.existingTags = res.data;
							}, function() {
								alert("error fetching tags");
							});

							$http.get("api/v1/menu/getMenu").success(
									function(response) {
										$scope.existingMenus = response.data;
									}, function(errorResponse) {
										if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
											$location.path('/users/login');
											 return;
								        }
										alert("error fetching menus");
									});

							var menuId = $routeParams.menuId;
							var url = "api/v1/menu/getMenuById?id=" + menuId;

							$scope.allTags = [ "" ];

							$scope.errorMessage = "";

							$scope.newMenu = {};
							$scope.parentMenu = {
								displayMenuName : ""
							};
							$scope.linkedMenu = {
								displayMenuName : ""
							};

							$scope.deleteMenu = function() {
								var isDelete = confirm("You are going to delete this menu and all its submenus!");
								if (isDelete == true) {
									var menuResource = new Menu();
									menuResource.id = $scope.newMenu.id;
									menuResource.$delete(function() {
										location.href = "#/menu/viewMenu";
									}, function(errorResponse) {
										if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
											$location.path('/users/login');
											 return;
								        }
										alert("error");
									});
								}

							}

							$scope.editMenu = function() {
								$scope.error = false;
								var menuResource = new Menu();
								menuResource.id = $scope.newMenu.id;
								menuResource.orderIdx = $scope.newMenu.orderIdx;
								menuResource.hidden = $scope.newMenu.hidden;
								menuResource.displayMenuName = $scope.newMenu.displayMenuName;
								menuResource.tags = $scope.allTags;
								menuResource.module = $scope.newMenu.module;
								menuResource.children = $scope.newMenu.children;
								menuResource.linkedMenuId = ($scope.linkedMenu && $scope.linkedMenu.id) ? $scope.linkedMenu.id
										: null;
								menuResource.displayMenuName = $scope.newMenu.displayMenuName;
								menuResource.parentMenuId = ($scope.parentMenu && $scope.parentMenu.id) ? $scope.parentMenu.id
										: null;
								menuResource.filterName = $scope.newMenu.filterName;

								if ($scope.allTags || $scope.allTags.length > 0) {
									for (var i = 0; i < $scope.allTags.length; i++) {
										if (!$scope.allTags[i].id) {
											$scope.errorMessage = "please select a valid tag";
											return;
										}
									}

								} else {
									$scope.errorMessage = "please select atleast one tag";
								}
								if (menuResource.module == undefined) {
									$scope.error = true;
									$scope.errorMessage = "please select a module for this menu";
								} else if (!menuResource.displayMenuName) {
									$scope.error = true;
									$scope.errorMessage = "please entter a display name";
								} else {
									menuResource
											.$save(
													function() {
														location.href = "#/menu/viewMenu";
													},
													function(errorResponse) {
														if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
															$location.path('/users/login');
															 return;
												        }
														console.log(errorResponse);
														$scope.error = true;
														$scope.errorMessage = errorResponse.data.localizedMessage
																|| errorResponse.data.message;
													});
								}

								function resetObjeccts() {
									$scope.parentMenu = "";
									$scope.linkedMenu = "";
									$scope.selectedTag = "";
								}

							}
							$scope.addTag = function() {
								$scope.allTags.push("");
							}
							$scope.removeTag = function(idx) {
								$scope.allTags.splice(idx, 1);
							}

							$http
									.get(url)
									.success(
											function(res) {
												res = res.data;
												$scope.newMenu = res;
												$scope.allTags = res.tags;
												if (res.linkedMenuId
														&& res.linkedMenuId.id) {
													$scope.linkedMenu = res.linkedMenuId;
												}
												if (res.parentMenuId) {
													$http
															.get(
																	"api/v1/menu/getMenuById?id="
																			+ res.parentMenuId)
															.success(
																	function(res) {
																		$scope.parentMenu = res.data;
																	})
												}
												$scope.newMenu.filterName = res.filterName;

											},function(errorResponse){
												if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
													$location.path('/users/login');
													 return;
										        }
											})

						} ]);