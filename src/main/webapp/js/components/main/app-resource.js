
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
			method : 'POST',
			params : {
				userId : 'new'
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

var AdminUserEdit = adminServices.factory('AdminUserEdit',
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
		query : {
			method : 'GET',
			isArray: false
		}
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
			method : 'POST',
			params : {
				discussId : 'new'
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
			return $resource('/byadmin/api/v1/discuss/list/P', {}, {
				query : {
					method : 'GET',
					isArray: false
				}
			})
		});

var discussByFilterPoll_admin = adminServices.factory('AdminPollDiscuss',
		function($resource) {
			return $resource('/byadmin/api/v1/discuss/list/POLL', {}, {
				query : {
					method : 'GET',
					isArray: false
				}
			})
		});

var discussByFilterFeedback_admin = adminServices.factory(
		'AdminFeedbackDiscuss', function($resource) {
			return $resource('/byadmin/api/v1/discuss/list/F', {}, {
				query : {
					method : 'GET',
					isArray: false
				}
			})
		});

var discussByFilterQuestion_admin = adminServices.factory(
		'AdminQuestionDiscuss', function($resource) {
			return $resource('/byadmin/api/v1/discuss/list/Q', {}, {
				query : {
					method : 'GET',
					isArray: false
				}
			})
		});

var AdminAnnouncements = adminServices.factory(
		'AdminAnnouncements', function($resource) {
			return $resource('/byadmin/api/v1/discuss/list/announceMents', {}, {
				query : {
					method : 'GET',
					isArray: false
				}
			})
		});

var discussByFilterArticle_admin = adminServices.factory('AdminArticleDiscuss',
		function($resource) {
			return $resource('/byadmin/api/v1/discuss/list/A', {}, {
				query : {
					method : 'GET',
					isArray: false
				}
			})
		});

var discussByFilter_admin = adminServices.factory('AdminDiscussList', function(
		$resource) {
	return $resource('/byadmin/api/v1/discuss/list/all', {}, {
		query : {
			method : 'GET',
			isArray: false
		}
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
			method : 'POST',
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
			isArray : false
		},
		'save' : {
			method : 'POST'
		}
	})
});

adminServices.factory('UserTag', function($resource) {
	return $resource('/byadmin/api/v1/menu/tag?type=1', {}, {
		'get' : {
			method : 'GET',
			isArray : false
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

adminServices.factory('BYMenu', function($resource) {
    return $resource('api/v1/menu/getMenu?parentId=root',{q: '*'}, {
        get: {method: 'GET', params: {}},
        query: {method: 'GET',interceptor: {
            response: function(response) {
                return response.data;
            }
        }, isArray: false}
    })
});


var activitiesList = adminServices.factory('ActivitiesList', function($resource) {
	return $resource('/byadmin/api/v1/activityLog/page', {}, {
		
		get : {
			method : 'GET',
			params : {}
		}
	})
});

var ActivitiesStats = adminServices.factory('ActivitiesStats', function($resource) {
	return $resource('/byadmin/api/v1/activityLog/getStats', {}, {
		get : {
			method : 'GET',
			params : {}
		}
	})
});

//New selected user profile
var userProfile = adminServices.factory('UserProfile', function ($resource) {
    return $resource('/byadmin/api/v1/userProfile/:userId', {}, {
        get: {method: 'GET', params: {}},
        post: {method: 'POST', params: {}},
        update: {method: 'PUT', params: {}}
    })
});

//User
var user = adminServices.factory('User', function ($resource) {
    return $resource('/byadmin/api/v1/users/:userId', {}, {
        get: {method: 'GET', params: {userId: '@id'}},
        post: {method: 'PUT', params: {userId: '@id'}},
        put: {method: 'PUT', params: {userId: '@id'}}
    })
});


adminServices.factory('UserSearch', function($resource) {
	return $resource('/byadmin/api/v1/userSearch', {}, {
		searchUser : {
			method : 'GET',
			isArray: true
		}
	})
});

adminServices.factory('UserDetailInfo', function($resource) {
	return{
		getBasicInfo: $resource('/byadmin/api/v1/userDetail/userInfo', {}, {
	        query: { method: 'GET',isArray: false }
	      }),
      getProfileInfo: $resource('/byadmin/api/v1/userDetail/userProfileInfo', {}, {
	        query: { method: 'GET',isArray: true }
	      }),
      getLastSessionInfo: $resource('/byadmin/api/v1/userDetail/lastSessionInfo', {}, {
	        query: { method: 'GET',isArray: false }
	      }),
	 getLastActivityInfo: $resource('/byadmin/api/v1/userDetail/lastActivityInfo', {}, {
	        query: { method: 'GET',isArray: false }
	      }),
	 getAllActivityInfo: $resource('/byadmin/api/v1/userDetail/activities', {}, {
	        query: { method: 'GET',isArray: true }
	      })	      
	}
});

adminServices.factory('UserProfile', function ($resource) {
    return $resource('/byadmin/api/v1/userProfile/:userId', {}, {
        get: {method: 'GET', params: {}},
        post: {method: 'POST', params: {}},
        update: {method: 'PUT', params: {}}
    })
});
