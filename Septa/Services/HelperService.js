(function () {
    "use strict";   
    var HelperService = function ($http, $q) {
        var deferObject;
        var HelperMethods = {
            getMyTrains: function(){
                var promise = $http.get('json/myTrains.json');
                deferObject = deferObject || $q.defer();
                
                promise.then(function(data){
                    deferObject.resolve(data);
                });
                
                return deferObject.promise;
            }
        };
        return HelperMethods;
    };
    
    HelperService.$inject = ['$http', '$q'];
    
    angular.module('appSepta')
	  .service('HelperService', HelperService);
    
}());