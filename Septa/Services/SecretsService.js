(function () {
    "use strict";   
    var SecretsService = function ($http, $q) {
        var SecretsMethods = {
            getSecrets: function(){
                var deferObject_Secrets;
                var Secrets_Promise = $http.get('json/Secrets/keys.json');
                deferObject_Secrets = deferObject_Secrets || $q.defer();
                
                Secrets_Promise.then(function(data){
                    deferObject_Secrets.resolve(data);                   
                },
                function(error){ //error
                    deferObject_Secrets.reject('There was a problem w/ Secrets');
                });
                
                return deferObject_Secrets.promise;
            }
        };
        return SecretsMethods;
    };
    
    SecretsService.$inject = ['$http', '$q'];
    
    angular.module('appSepta')
	  .service('SecretsService', SecretsService);
    
}());