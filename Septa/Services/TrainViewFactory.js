(function () {
    "use strict";
    var TrainViewFactory = function () {
//        var Trains = [
//            {"lat": "39.96349", "lon": "-75.18513", "trainno": "829", "service": "LOCAL", "dest": "Chestnut H West", "nextstop": "North Philadelphia", "late": 2, "SOURCE": "Fox Chase", "TRACK": "", "TRACK_CHANGE": ""}, 
//            {"lat": "40.005242", "lon": "-75.165902", "trainno": "832", "service": "LOCAL", "dest": "Fox Chase", "nextstop": "North Philadelphia", "late": 6, "SOURCE": "Chestnut H West", "TRACK": "", "TRACK_CHANGE": ""}, 
//            {"lat": "39.88648", "lon": "-75.31239", "trainno": "9231", "service": "LOCAL", "dest": "Marcus Hook", "nextstop": "Ridley Park", "late": 5, "SOURCE": "Temple U", "TRACK": "", "TRACK_CHANGE": ""}, 
//            {"lat": "39.84893", "lon": "-75.36160", "trainno": "9238", "service": "LOCAL", "dest": "Temple U", "nextstop": "Eddystone", "late": 10, "SOURCE": "Wilmington", "TRACK": "", "TRACK_CHANGE": ""}];
        
//        var Trains_PromiseReturn = HelperService.getSeptaTrains(); 
//        Trains_PromiseReturn.then(function(data){
//            var Trains_data = data;
//            var Trains = Trains_data.data;
//            //console.log(Trains);
//        });

        var factory = {};

        factory.getTrains = function () {
            return Trains;
        };

        factory.getThisTrain = function (Trains, trainno) {            
            for (var i=0,len=Trains.length; i<len; i++){
                if (Trains[i].trainno == trainno) {
                    return Trains[i];
                }
            }
            return null;
        };

        return factory;
    };  
    
    TrainViewFactory.$inject = [];
    
    angular.module('appSepta')
        .factory('TrainViewFactory', TrainViewFactory);
    
}());