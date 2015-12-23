(function () {
    "use strict";
    var MainController = function ($scope, HelperService, TrainViewFactory) {
        var trainno = '9231'; //temp value
        $scope.ThisTrain = null;       
        
//      $scope.nowHour = moment().hour();
        $scope.today_dayOftheWeek = moment().day();
        $scope.IsWeekDay = (($scope.today_dayOftheWeek === 0) || ($scope.today_dayOftheWeek === 6)) ? false : true ;
//        $scope.checkNowTime = moment($scope.nowHour).isBetween(12, 14);
        
        if($scope.IsWeekDay){
            var promise = HelperService.getMyTrains();
            promise.then(function (data){
                $scope.myTrains = data;                                
            });
        };
        
        function init() {
            $scope.ThisTrain = TrainViewFactory.getThisTrain(trainno);
        }        
        init();
        
//      console.log($scope.nowHour);
//      console.log($scope.checkNowTime);        
        console.log($scope.myTrains);
        console.log($scope.IsWeekDay);
        console.log($scope.ThisTrain);
    };
    
    MainController.$inject = ['$scope', 'HelperService', 'TrainViewFactory'];
    
    angular.module('appSepta')
        .controller('MainController', MainController);
    
}());
