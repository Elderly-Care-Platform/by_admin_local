byAdminApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/comment/:parentId/:ancestorId', {templateUrl: 'views/discuss/list2.html', controller: 'CommentListController'})
    .when('/comment/:commentId', {templateUrl: 'views/discuss/edit2.html', controller: 'AdminCommentCreateController'})
	.when('/comment/edit/:commentId', {templateUrl: 'views/discuss/list2.html', controller: 'AdminCommentCreateController'})
	.when('/comment/delete/:commentId', {templateUrl: 'views/discuss/list2.html', controller: 'AdminCommentDeleteController'})

    .when('/users/all', {templateUrl: 'views/users/list.html', controller: 'AdminUserListController'})
    .when('/users/new', {templateUrl: 'views/users/create.html', controller: 'AdminUserCreateController'})
    .when('/users/showedit/:userId', {templateUrl: 'views/users/edit.html', controller: 'AdminUserEditController'})
    .when('/users/showedit/:userId', {templateUrl: 'views/users/edit.html', controller: 'AdminUserCreateController'})
    .when('/users/delete/:userId', {templateUrl: 'views/users/list.html', controller: 'AdminUserDeleteController'})
    .when('/users/login', {templateUrl: 'views/users/login.html', controller: 'AdminLoginController'})
    .when('/users/logout/:sessionId', {templateUrl: 'views/users/list.html', controller: 'AdminLogoutController'})
    .when('/discuss/all', {templateUrl: 'views/discuss/list.html', controller: 'AdminDiscussListController'})
    .when('/discuss/P', {templateUrl: 'views/discuss/list.html', controller: 'AdminListPostController'})
    .when('/discuss/F', {templateUrl: 'views/discuss/feedbackList.html', controller: 'AdminListFeedbackController'})
      .when('/discuss/Q', {templateUrl: 'views/discuss/list.html', controller: 'AdminListQuestionController'})
      .when('/discuss/A', {templateUrl: 'views/discuss/list.html', controller: 'AdminListArticleController'})
      .when('/discuss/new/P', {templateUrl: 'views/discuss/create.html', controller: 'AdminDiscussCreateController'})
	  .when('/discuss/new/Q', {templateUrl: 'views/discuss/create.html', controller: 'AdminDiscussCreateController'})
	  .when('/discuss/new/A', {templateUrl: 'views/discuss/create.html', controller: 'AdminDiscussCreateController'})
	  .when('/discuss/showedit/:discussId', {templateUrl: 'views/discuss/edit.html', controller: 'AdminDiscussCreateController'})
	  .when('/discuss/edit/:discussId', {templateUrl: 'views/discuss/list.html', controller: 'AdminDiscussCreateController'})
	  .when('/discuss/delete/:discussId', {templateUrl: 'views/discuss/list.html', controller: 'AdminDiscussDeleteController'})
      .when('/discuss/:discussId', {templateUrl: 'views/discuss/detail.html', controller: 'AdminDiscussDetailController'})
      
      .when('/menu', {templateUrl: 'views/menu/listMenu.html', controller: 'MenuController'})
      .when('/menu/addTag', {templateUrl: 'views/menu/createTag.html', controller: 'TagCreateController'})
      .when('/menu/addMenu', {templateUrl: 'views/menu/createMenu.html', controller: 'MenuCreateController'})
      .when('/menu/viewMenu', {templateUrl: 'views/menu/viewMenu.html', controller: 'MenuViewController'})
      .when('/menu/editMenu/:menuId', {templateUrl: 'views/menu/editMenu.html', controller: 'MenuEditController'})
      ;
    //?????$routeProvider.otherwise({redirectTo: '/users/login'});
  }]);