(function () {
    "use strict";
    var MainController = function ($scope, TrainViewFactory) {
        var trainno = '9231';
        $scope.ThisTrain = null;
        
        function init() {
            $scope.ThisTrain = TrainViewFactory.getThisTrain(trainno);
        }
        init();        
        console.log($scope.ThisTrain);
    };
    
    MainController.$inject = ['$scope', 'TrainViewFactory'];
    
    angular.module('appSepta')
        .controller('MainController', MainController);
    
}());
