(function () {
    "use strict";
    var FireBaseFactory = function ($http, $q, $firebaseArray) {
        var factory_FireBase = {};
        var ref = new Firebase('https://iot-septa.firebaseio.com');
        var events = $firebaseArray(ref);
        
        factory_FireBase.intoFireBase = function(ThisTrain){
//            console.log(ThisTrain);
            return events.$add(ThisTrain);
        };
        
        return factory_FireBase;        
    };
        
    FireBaseFactory.$inject = ['$http', '$q', '$firebaseArray'];
    
    angular.module('appSepta')
        .factory('FireBaseFactory', FireBaseFactory);
    
}());