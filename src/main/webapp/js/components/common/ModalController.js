/**
 * 
 */

/**
 * 
 */
'use strict';

(function (angular) {
    'use strict';
    
    adminControllers.controller('ModalCtrl', ModalCtrl);
    ModalCtrl.$inject = ['$scope'];
    
    function ModalCtrl($scope){
    	$scope.showModal = false;
    	console.log("hello");
    	$scope.toggleModal = function(id){
    		console.log("hello");
        	$scope.showModal = !$scope.showModal;
        	//console.log(id)  
    	};
	};
	
}(angular));
