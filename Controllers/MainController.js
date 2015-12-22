(function () {
    "use strict";
    var MainController = function ($scope) {
        $scope.message = "";
        $scope.left  = function () {return 100 - $scope.message.length; };
    };
    
    MainController.$inject = ['$scope'];
    
    angular.module('appSepta')
        .controller('MainController', MainController);
        
}());
