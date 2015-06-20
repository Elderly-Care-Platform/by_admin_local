var myApp = angular.module('myApp', ['ui.tinymce']);
function TestCtrl($scope, $http) {
    $scope.post = {
      text :'this is test text'
    }
};
