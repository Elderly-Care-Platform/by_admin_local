adminControllers.controller('AdminPollCreateController', ['$scope', '$http', '$route', '$routeParams', '$location', 'AdminDiscuss', 'MenuTag', '$rootScope',
    function ($scope, $http, $route, $routeParams, $location, AdminDiscuss, MenuTag, $rootScope) {
        
        $scope.allOptions = [ "" ];
	 		
 		$scope.addOption = function() {
			$scope.allOptions.push("");
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

    }]);


adminControllers.controller('AdminPollPostController', ['$scope', '$rootScope', '$location', 'AdminPostDiscuss',
    function ($scope, $rootScope, $location, AdminPostDiscuss) {
      
    }]);

