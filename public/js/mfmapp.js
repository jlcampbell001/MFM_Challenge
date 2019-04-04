var app = angular.module('myApp', ['ngRoute', 'ngResource']);

/*
app.factory('appService', function ($resource) {
    return $resource('/bc');
});
*/

app.factory('bcService', function ($http) {
    var baseUrl = "/bc";
    var factory = {};
    factory.getAll = function () {

        return $http.get(baseUrl);
    };
    return factory;
});


app.controller('myCtrl', function ($scope, $http) {
    $scope.workAddress = 'mnJqb7kq16PEKHuxPjGoEPcREpuKFSSmSs';

    $scope.getAddrData = function () {
        $scope.workAddrErr = '';
        $http.get('/bc/' + $scope.workAddress).then(function (response) {
            data = response.data;
            $scope.workAddrErr = JSON.stringify(data.error);
            $scope.addrBalance = JSON.stringify(data.balance);
        });
    }

});


