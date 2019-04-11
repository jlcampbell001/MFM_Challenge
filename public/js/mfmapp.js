var app = angular.module('myApp', ['ngRoute', 'ngResource']);


app.controller('myCtrl', function ($scope, $http) {
    // Initalize the page variables.
    $scope.workAddress = 'CCynbmaZdeBgHo4FZQ3qLj47hZxhWiJTgH';
    $scope.workAddrErr = '';
    $scope.addrBalance = 0.0;
    $scope.unconfirmedBalance = 0.0;
    $scope.finalBalance = 0.0;
    $scope.trans = {};
    $scope.trans.toAddr = '';
    $scope.toAmount = 0.00000001;
    $scope.trans.priK = '';
    $scope.trans.pubK = '';
    $scope.workTrans = [];

    /*
    Get the address and tranaction data for the current working address.
    */
    $scope.getAddrData = function () {
        $scope.workAddrErr = '';
        $scope.addrBalance = 0.0;
        $scope.addrBalance = 0.0;
        $scope.unconfirmedBalance = 0.0;
        $scope.finalBalance = 0.0;
        $scope.trans.toAddr = '';
        $scope.toAmount = 0.00000001;
        $scope.trans.priK = '';
        $scope.trans.pubK = '';
        $scope.workTrans = [];

        $http.get('/bc/transactions/' + $scope.workAddress).then(function (response) {
            data = response.data;
            if (data.errors) {
                $scope.workAddrErr = data.errors;
            } else {
                $scope.addrBalance = data.balance;
                $scope.unconfirmedBalance = data.unconfirmed_balance;
                $scope.finalBalance = data.final_balance;
                $scope.trans.priK = data.private;
                $scope.trans.pubK = data.public;

                // Add any confirmed transactions.
                if (data.txrefs) {
                    $scope.workTrans = data.txrefs;
                }

                // If there are unconfimed transactions add them to the transactions array.
                if (data.unconfirmed_txrefs) {
                    tmpTxs = $scope.workTrans.concat(data.unconfirmed_txrefs);
                    $scope.workTrans = tmpTxs;
                }

                // Setup a transaction date / time field.
                setupTransDateTime($scope.workTrans);
            }
        });
    }

    /*
    Create a new address and fill it with some bit coins.
    */
    $scope.getNewAddr = function () {
        $http.get('/bc/-1').then(function (response) {
            data = response.data;
            if (data.error) {
                $scope.workAddrErr = data.errors;
            } else {
                $scope.workAddress = data.address;

                $http.get('/bc/faucet/' + $scope.workAddress).then(function (response) {
                    data = response.data;
                    if (data.error) {
                        $scope.workAddrErr = data.errors;
                    } else {
                        // Get the new address data.
                        $scope.getAddrData();
                    }
                });
            }
        });
    }

    /*
    Post the transaction the user filled in.
    */
    $scope.postTransaction = function () {
        $scope.workAddrErr = '';
        $scope.trans.fromAddr = $scope.workAddress;
        $scope.trans.toAmount = $scope.toSatoshis($scope.toAmount);

        $http.post('/bc/' + JSON.stringify($scope.trans)).then(function (response) {
            data = response.data;
            if (data.errors) {
                $scope.workAddrErr = data.errors;
            } else {
                // Get the new address data.
                $scope.getAddrData();
            }
        });
    }

    /*
    Convert bit coins to satoshis.
    */
    $scope.toSatoshis = function (btc) {
        return btc * 100000000;
    }

    /*
    Convert staoshis to bit coins.
    */
    $scope.toBTC = function (satoshis) {
        return satoshis / 100000000;
    }
});

/*
Setup the transaction data / time fields.
Either using the confirmed date / time or for unconfirmed the recived date / time.
*/
function setupTransDateTime(trans) {
    for (i = 0; i < trans.length; i++) {
        if (trans[i].confirmed) {
            trans[i].tranDT = trans[i].confirmed;
        } else {
            trans[i].tranDT = trans[i].received;
        }
    }
}

