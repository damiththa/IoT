(function () {
    "use strict";
    var appSepta = angular.module('appSepta', ['firebase']);
    
    appSepta.run(function($http, $rootScope){
        $http.get('json/Secrets/keys.json').
        success(function(data, status, headers, config) {
            //alert('config'+ data.name);
            $rootScope.secrets = data;
            $rootScope.$broadcast('secrets-loaded');
        }).
        error(function(data, status, headers, config) {
            // log error
            alert('error');
        });
    })
}());