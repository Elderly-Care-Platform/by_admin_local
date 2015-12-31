adminControllers
		.controller(
				'UserProfileInfoController',
				[
						'$scope',
						'$routeParams',
						'$location',
						'UserDetailInfo',
						function($scope, $routeParams, $location,
								UserDetailInfo) {
							if (localStorage.getItem("ADMIN_USER_ROLE") != 'SUPER_USER') {
								return;
							}
							$scope.userId = $scope.$parent.userId;
							$scope.profileData = null;
							$scope.viewDisplayStatus = false;
							$scope.toggleDisplay = function() {
								$scope.viewDisplayStatus = !$scope.viewDisplayStatus;
								if ($scope.viewDisplayStatus) {
									showProfileInfo();
								}
							}

							$scope.state = "loading";

							function showProfileInfo() {
								if (!$scope.profileData) {
									UserDetailInfo.getProfileInfo.query({
										"userId" : $scope.userId
									}, function(res) {
										$scope.state = "loaded";
										$scope.profileData = res;
										var str = JSON.stringify(res,
												undefined, 4);
										output(syntaxHighlight(str));
									}, function(err) {
										$scope.state = "error";
									});
								}else{
									var str = JSON.stringify($scope.profileData,
											undefined, 4);
									output(syntaxHighlight(str));
								}
							}

							function output(inp) {
								setTimeout(function(){
									document.getElementById("userProfilesDataInfo").innerHTML = "";
									document.getElementById("userProfilesDataInfo")
									.appendChild(
											document.createElement('pre')).innerHTML = inp;
								},200);
								
							}

							function syntaxHighlight(json) {
								json = json.replace(/&/g, '&amp;').replace(
										/</g, '&lt;').replace(/>/g, '&gt;');
								return json
										.replace(
												/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
												function(match) {
													var cls = 'number';
													if (/^"/.test(match)) {
														if (/:$/.test(match)) {
															cls = 'key';
														} else {
															cls = 'string';
														}
													} else if (/true|false/
															.test(match)) {
														cls = 'boolean';
													} else if (/null/
															.test(match)) {
														cls = 'null';
													}
													return '<span style="color:'
															+ getColor(cls)
															+ '">'
															+ match
															+ '</span>';
												});
							}

							function getColor(str) {
								var ret = "black";
								switch (str) {
								case "string":
									ret = "green";
									break;
								case "number":
									ret = "darkorange";
									break;
								case "boolean":
									ret = "blue";
									break;
								case "null":
									ret = "magenta";
									break;
								case "key":
									ret = "red";
									break;
								default:

								}

								return ret;
							}
						} ]);