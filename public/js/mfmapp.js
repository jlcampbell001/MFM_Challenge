var app = angular.module('myApp', ['ngRoute', 'ngResource']);


app.controller('myCtrl', function ($scope, $http) {
    $scope.workAddress = 'mnJqb7kq16PEKHuxPjGoEPcREpuKFSSmSs';
    $scope.workTrans = [];

    $scope.getAddrData = function () {
        $scope.workAddrErr = '';
        $http.get('/bc/' + $scope.workAddress).then(function (response) {
            data = response.data;
            $scope.workAddrErr = data.error;
            $scope.addrBalance = data.balance;
        });

        $http.get('/bc/transactions/' + $scope.workAddress).then(function (response) {
            data = response.data;
            $scope.workTrans = [];
            $scope.workAddrErr = data.error;
            $scope.workTrans = data.txrefs;
        });
    }
});


