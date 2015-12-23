(function () {
    "use strict";
    var HelperService = function ($http, $q) {        		
        var deffered = $q.defer();
        $http.get('json/myTrains.json').then(function(data)
        {
           deffered.resolve(data); 
        });
        
        this.getMyTrains = function(){
            return deffered.promise;
        }
    };
    
    HelperService.$inject = ['$http', '$q'];
    
    angular.module('appSepta')
	  .service('HelperService', HelperService);
    
}());