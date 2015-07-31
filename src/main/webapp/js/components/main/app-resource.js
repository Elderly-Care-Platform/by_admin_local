var discussCategoryList = adminServices.factory('discussCategoryList',
		function($resource) {
			return $resource('api/v1/topic/list/all', {
				q : '*'
			}, {
				'query' : {
					method : 'GET',
					interceptor : {
						response : function(response) {
							return response.data;
						}
					}
				}

			})
		});

// User
var user_admin = adminServices.factory('AdminUser', function($resource) {
	return $resource('/byadmin/api/v1/users/:userId', {}, {
		remove : {
			method : 'DELETE',
			params : {
				userId : '@id'
			}
		},
		update : {
			method : 'PUT',
			params : {
				userId : '@id'
			}
		},
		get : {
			method : 'GET',
			params : {
				userId : '@id'
			}
		}
	})
});

var userShow_admin = adminServices.factory('AdminUserShow',
		function($resource) {
			return $resource('/byadmin/api/v1/users/show/:userId', {}, {
				show : {
					method : 'GET',
					params : {
						userId : '@id'
					}
				},
				get : {
					method : 'GET',
					params : {
						userId : '@id'
					}
				}
			})
		});

var userEdit_admin = adminServices.factory('AdminUserEdit',
		function($resource) {
			return $resource('/byadmin/api/v1/users/edit/:userId', {}, {
				get : {
					method : 'GET',
					params : {
						userId : '@id'
					}
				}
			})
		});

var userByFilter_admin = adminServices.factory('AdminUserList', function(
		$resource) {
	return $resource('/byadmin/api/v1/users/list/all', {}, {

	})
});

// Discuss - admin
var discuss_admin = adminServices.factory('AdminDiscuss', function($resource) {
	return $resource('/byadmin/api/v1/discuss/:discussId', {}, {
		remove : {
			method : 'DELETE',
			params : {
				discussId : '@id'
			}
		},
		update : {
			method : 'PUT',
			params : {
				discussId : '@id'
			}
		},
		get : {
			method : 'GET',
			params : {
				discussId : '@id'
			}
		}
	})
});

var discussByFilterPost_admin = adminServices.factory('AdminPostDiscuss',
		function($resource) {
			return $resource('/byadmin/api/v1/discuss/list/P', {}, {})
		});

var discussByFilterFeedback_admin = adminServices.factory(
		'AdminFeedbackDiscuss', function($resource) {
			return $resource('/byadmin/api/v1/discuss/list/F', {}, {})
		});

var discussByFilterQuestion_admin = adminServices.factory(
		'AdminQuestionDiscuss', function($resource) {
			return $resource('/byadmin/api/v1/discuss/list/Q', {}, {})
		});

var discussByFilterArticle_admin = adminServices.factory('AdminArticleDiscuss',
		function($resource) {
			return $resource('/byadmin/api/v1/discuss/list/A', {}, {})
		});

var discussByFilter_admin = adminServices.factory('AdminDiscussList', function(
		$resource) {
	return $resource('/byadmin/api/v1/discuss/list/all', {}, {

	})
});

// //////////////////////////////comments
// ///////////////////////////////////////////////////
var commentByFilter_admin = adminServices.factory('AdminCommentList', function(
		$resource) {
	return $resource('/byadmin/api/v1/comment/:parentId/:ancestorId', {}, {
	// get: {method: 'GET', params: {parentId: '@discussId', ancestorId:
	// '@ancestorId'}}

	})
});

var discuss_admin = adminServices.factory('AdminComment', function($resource) {
	return $resource('/byadmin/api/v1/comment/:commentId', {}, {
		remove : {
			method : 'DELETE',
			params : {
				commentId : '@id'
			}
		},
		update : {
			method : 'PUT',
			params : {
				commentId : '@id'
			}
		},
		get : {
			method : 'GET',
			params : {
				commentId : '@id'
			}
		}
	})
});
// //////////////////////////////comments
// ///////////////////////////////////////////////////

var discussShow_admin = adminServices.factory('AdminDiscussShow', function(
		$resource) {
	return $resource('/byadmin/api/v1/discuss/show/:discussId', {}, {
		show : {
			method : 'GET',
			params : {
				discussId : '@id'
			}
		},
		get : {
			method : 'GET',
			params : {
				discussId : '@id'
			}
		}
	})
});

adminServices.factory('MenuTag', function($resource) {
	return $resource('/byadmin/api/v1/menu/tag', {}, {
		'get' : {
			method : 'GET',
			isArray : true
		},
		'save' : {
			method : 'POST'
		}
	})
});

adminServices.factory('Menu', function($resource) {
	return $resource('/byadmin/api/v1/menu', {}, {
		'save' : {
			method : 'POST'
		},
		'delete' : {
			method : 'DELETE',
			params: {
				id : '@id'
			}
		}
	})
});
