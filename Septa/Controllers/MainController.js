(function () {
    "use strict";
    var MainController = function ($scope, HelperService, TrainViewFactory) {
        var trainno = '9231'; //temp value
        $scope.ThisTrain = null;       
        
        $scope.nowHour = moment().hour();
        $scope.today_dayOftheWeek = moment().day();
        $scope.IsWeekDay = (($scope.today_dayOftheWeek === 0) || ($scope.today_dayOftheWeek === 6)) ? false : true ;
        $scope.checkTimeSlot = moment($scope.nowHour).isBetween(8, 11) ? 'morning' : 'evening';
        
        //NOTE :  doesn't need to be in init()
        function init() {
            $scope.ThisTrain = TrainViewFactory.getThisTrain(trainno);
        }        
        init();
        
        if($scope.IsWeekDay){
            var promise = HelperService.getMyTrains();
            promise.then(function (data){
                $scope.myTrains = data;    
                console.log($scope.myTrains);
            });
        };
        
        console.log($scope.nowHour);
        console.log($scope.checkTimeSlot);        
        console.log($scope.IsWeekDay);
        console.log($scope.ThisTrain);
    };
    
    MainController.$inject = ['$scope', 'HelperService', 'TrainViewFactory'];
    
    angular.module('appSepta')
        .controller('MainController', MainController);
    
}());
