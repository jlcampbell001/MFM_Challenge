var express = require('express');
var router = express.Router();
var bcypher = require('blockcypher');
var buffer = require('buffer');
var eccrypto = require("eccrypto");

/*
Currently set to blockcypher testing because it will return coins to the faucet.
To change to bitcoin comment out the blockcypher and uncomment the bitcon
*/
// Bitcoin Test
//var bcapi = new bcypher('btc', 'test3', '');

// Blockcypher Test
var bcapi = new bcypher('bcy', 'test', '');

// Schema for an address record for the addresses array.
function addressRec(address, publicKey, privateKey) {
    this.address = address;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
}

/*
A list of addresses that can be looked up to get the public and private keys from.
This will get reset eveytime the server is run.
*/
var addresses = [];

/*
Two test addresses to work with that have coins.
*/
addToAddresses('CCynbmaZdeBgHo4FZQ3qLj47hZxhWiJTgH', '02ceda6adc01be2c6f74fa115ff8f418a04d3b008dc59c7fff6328c55c75e654de', '171ba94c5a3139f7ba4eda01513375919a90c73d8715a7388e1bd73121220048');
addToAddresses('CA6DpSbohSE3JqM5fEfGuZk6tQsopi3Bxi', '025c352255f45cd97d70fcfa1c3c2531f1fda9a224cffb43731388961af6aa8085', 'a9e43a9b28dbd7c76870ee8f809634c899d5f6dbb5bb0bb2a05dd4efc928bac6');

router.route('/:id')
    .get(function (req, res) {
        if (req.params.id == '-1') {
            // Create a new address with keys.
            bcapi.genAddr('', function (err, data) {
                if (err) {
                    setupErrors(err, err);
                    res.send(err);
                }
                if (data.error) {
                    setupErrors(data, data.error);
                } else {
                    // Add the address to the address array for possible look up later.
                    addToAddresses(data.address, data.public, data.private);
                }
                res.json(data);
            });
        } else {
            bcapi.getAddrBal(req.params.id, '', function (err, data) {
                // Try and get an address and its balance.
                if (err) {
                    setupErrors(err, err);
                    res.send(err);
                }
                if (data.error) {
                    setupErrors(data, data.error);
                }
                res.json(data);
            });
        }
    })
    .post(function (req, res) {
        // Setup and send a new transaction.

        // Get the transaction data to work with. 
        var trans = JSON.parse(req.params.id);

        // Setup the needed variables.
        var address = trans.fromAddr;
        var publicKey = trans.pubK;
        var privateKey = trans.priK;
        var amount = trans.toAmount;
        var toAddress = trans.toAddr;

        // Create a new transaction.
        var tx = {
            inputs: [{ addresses: [address] }],
            outputs: [{ addresses: [toAddress], value: amount }]
        };
        bcapi.newTX(tx, function (err, tmpTX) {
            if (err) {
                setupErrors(err, err);
                res.send(err);
            }

            if (!tmpTX.errors) {

                // Fill in the public key and sign the transaction.
                tmpTX.pubkeys = [];
                tmpTX.pubkeys.push(publicKey);

                tmpTX.signatures = [];

                signature = '';

                eccrypto.sign(Buffer.from(privateKey, 'hex'), Buffer.from(tmpTX.tosign[0], 'hex')).then(function (sig) {
                    tmpTX.signatures.push(sig.toString('hex'));

                    // Send the new transaction.
                    bcapi.sendTX(tmpTX, function (err, data) {
                        if (err) {
                            res.send(err);
                        }
                        res.json(data);
                    });
                });
            } else {
                res.json(tmpTX);
            }
        });
    });


router.route('/transactions/:id')
    .get(function (req, res) {
        // Get the address and the transactions for that address.
        bcapi.getAddr(req.params.id, '', function (err, data) {
            if (err) {
                setupErrors(err, err);
                res.send(err);
            }
            if (data.error) {
                setupErrors(data, data.error);
            }
            data.private = '';
            data.public = '';

            // Get the address keys if known from the address array.
            appendAddressData(data, data.address);
            console.log(data);
            res.json(data);
        });
    });

router.route('/faucet/:id')
    .get(function (req, res) {
        /*
        Fill a new address with coins.
        I think this is the max number of bit coins a faucet call can add.
        */
        bcapi.faucet(req.params.id, 500000, function (err, data) {
            if (err) {
                setupErrors(err, err);
                res.send(err);
            }
            if (data.error) {
                setupErrors(data, data.error);
            }
            res.json(data);
        });
    });

/*
Add an errors array to a respons and fill it with the passed message.
*/
function setupErrors(data, errorMsg) {
    if (!data.errors) {
        data.errors = [];
    }

    data.errors.push(errorMsg);
}

/*
Add the passed address data to the address array for look up later.
*/
function addToAddresses(address, publicKey, privateKey) {
    addresses.push(new addressRec(address, publicKey, privateKey));
}

/*
Look up the passed address and if found added it to the data.
*/
function appendAddressData(data, address) {
    var foundAddress = addresses.find(function (element) {
        return element.address === address;
    });

    if (foundAddress) {
        data.address = foundAddress.address;
        data.private = foundAddress.privateKey;
        data.public = foundAddress.publicKey;
    }
}

module.exports = router;